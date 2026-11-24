import { UserRole, type User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { Errors } from "../../utils/errors.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { hashToken, randomToken } from "../../utils/crypto.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.service.js";
import type { LoginInput, ProviderRegisterInput, RegisterInput } from "./auth.schemas.js";

const SESSION_TTL_MS = env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const LOCKOUT_THRESHOLD = 10;
const LOCKOUT_MS = 15 * 60 * 1000;

export interface SessionMeta { ipAddress?: string; userAgent?: string }

function safeUser(user: User) {
  return {
    id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone,
    isEmailVerified: user.isEmailVerified, createdAt: user.createdAt,
  };
}

async function createSession(userId: string, meta: SessionMeta) {
  const token = randomToken(32);
  const csrfToken = randomToken(32);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), csrfToken, expiresAt, ipAddress: meta.ipAddress, userAgent: meta.userAgent?.slice(0, 512) },
  });
  return { token, csrfToken, expiresAt };
}

async function createEmailVerification(userId: string, email: string, name: string) {
  const token = randomToken(32);
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL_MS) },
  });
  await sendVerificationEmail(email, name, token);
}

export async function registerUser(input: RegisterInput, meta: SessionMeta) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw Errors.conflict("Unable to register with the provided email");
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, role: UserRole.HOMEOWNER, name: input.name, phone: input.phone || null },
  });
  await createEmailVerification(user.id, user.email, user.name);
  await prisma.auditLog.create({ data: { actorId: user.id, action: "USER_REGISTERED", entityType: "User", entityId: user.id, ipAddress: meta.ipAddress, userAgent: meta.userAgent } });
  const session = await createSession(user.id, meta);
  return { user: safeUser(user), session };
}

export async function registerProvider(input: ProviderRegisterInput, meta: SessionMeta) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw Errors.conflict("Unable to register with the provided email");
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email: input.email, passwordHash, role: UserRole.PROVIDER, name: input.name, phone: input.phone || null },
    });
    const profile = await tx.providerProfile.create({
      data: {
        userId: created.id,
        displayName: input.name,
        specialty: input.specialty,
        city: input.city,
        experienceYears: input.experienceYears,
        bio: input.bio ?? "",
        rateRange: input.rateRange || null,
        phone: input.phone || null,
        publicEmail: input.email,
        verificationStatus: "PENDING",
        isVerified: false,
      },
    });
    const services = (input.services && input.services.length > 0 ? input.services : [input.specialty])
      .map((s) => s.trim()).filter(Boolean);
    if (services.length) {
      await tx.providerService.createMany({ data: services.map((name) => ({ providerId: profile.id, name })), skipDuplicates: true });
    }
    await tx.providerVerification.create({ data: { providerId: profile.id, status: "PENDING", notes: "Initial registration" } });
    await tx.auditLog.create({ data: { actorId: created.id, action: "PROVIDER_REGISTERED", entityType: "ProviderProfile", entityId: profile.id, ipAddress: meta.ipAddress, userAgent: meta.userAgent } });
    return created;
  });
  await createEmailVerification(user.id, user.email, user.name);
  const session = await createSession(user.id, meta);
  return { user: safeUser(user), session };
}

export async function login(input: LoginInput, meta: SessionMeta) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const generic = () => Errors.unauthorized("Invalid email or password");
  if (!user || user.deletedAt) throw generic();
  if (user.lockoutUntil && user.lockoutUntil > new Date()) throw Errors.tooMany("Too many login attempts. Please try again later.");
  const ok = await verifyPassword(user.passwordHash, input.password);
  if (!ok) {
    const failed = user.failedLoginCount + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: failed, lockoutUntil: failed >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_MS) : null },
    });
    throw generic();
  }
  await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockoutUntil: null, lastLoginAt: new Date() } });
  const session = await createSession(user.id, meta);
  await prisma.auditLog.create({ data: { actorId: user.id, action: "USER_LOGIN", entityType: "User", entityId: user.id, ipAddress: meta.ipAddress, userAgent: meta.userAgent } });
  return { user: safeUser(user), session };
}

export async function logout(sessionToken: string | undefined) {
  if (!sessionToken) return;
  await prisma.session.updateMany({ where: { tokenHash: hashToken(sessionToken), revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function getSession(sessionToken: string | undefined) {
  if (!sessionToken) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(sessionToken) }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.deletedAt) return null;
  return session;
}

export async function verifyEmail(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
  if (!record || record.usedAt || record.expiresAt <= new Date()) throw Errors.badRequest("Invalid or expired verification token");
  await prisma.$transaction([
    prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { isEmailVerified: true, emailVerifiedAt: new Date() } }),
    prisma.emailVerificationToken.updateMany({ where: { userId: record.userId, usedAt: null, id: { not: record.id } }, data: { usedAt: new Date() } }),
  ]);
}

export async function resendVerification(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isEmailVerified || user.deletedAt) return;
  await prisma.emailVerificationToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
  await createEmailVerification(user.id, user.email, user.name);
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt) return;
  const token = randomToken(32);
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) } });
  await sendPasswordResetEmail(user.email, user.name, token);
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt <= new Date()) throw Errors.badRequest("Invalid or expired reset token");
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash, failedLoginCount: 0, lockoutUntil: null } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.passwordResetToken.updateMany({ where: { userId: record.userId, usedAt: null, id: { not: record.id } }, data: { usedAt: new Date() } }),
    prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Errors.unauthorized();
  const ok = await verifyPassword(user.passwordHash, currentPassword);
  if (!ok) throw Errors.badRequest("Current password is incorrect");
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
}

export function toSafeUser(user: User) { return safeUser(user); }
