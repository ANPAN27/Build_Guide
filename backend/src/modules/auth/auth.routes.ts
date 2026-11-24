import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";
import { ok, okMessage } from "../../utils/http.js";
import { parseBody } from "../../utils/validate.js";
import { requireAuth, requireCsrf } from "../../middleware/auth.js";
import {
  registerSchema, providerRegisterSchema, loginSchema, emailTokenSchema,
  resendVerificationSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema,
} from "./auth.schemas.js";
import * as authService from "./auth.service.js";

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(registerSchema, request.body);
    const result = await authService.registerUser(body, { ipAddress: request.ip, userAgent: request.headers["user-agent"] });
    reply.setCookie(env.SESSION_COOKIE_NAME, result.session.token, cookieOptions(result.session.expiresAt));
    return ok(reply, { user: result.user, csrfToken: result.session.csrfToken }, 201);
  });

  app.post("/auth/register-provider", { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(providerRegisterSchema, request.body);
    const result = await authService.registerProvider({ ...body, bio: body.bio ?? "", rateRange: body.rateRange ?? "", services: body.services ?? [] }, { ipAddress: request.ip, userAgent: request.headers["user-agent"] });
    reply.setCookie(env.SESSION_COOKIE_NAME, result.session.token, cookieOptions(result.session.expiresAt));
    return ok(reply, { user: result.user, csrfToken: result.session.csrfToken }, 201);
  });

  app.post("/auth/login", { config: { rateLimit: { max: env.LOGIN_RATE_LIMIT_MAX, timeWindow: env.LOGIN_RATE_LIMIT_WINDOW_MS } } }, async (request, reply) => {
    const body = parseBody(loginSchema, request.body);
    const result = await authService.login(body, { ipAddress: request.ip, userAgent: request.headers["user-agent"] });
    reply.setCookie(env.SESSION_COOKIE_NAME, result.session.token, cookieOptions(result.session.expiresAt));
    return ok(reply, { user: result.user, csrfToken: result.session.csrfToken });
  });

  app.post("/auth/logout", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    await authService.logout(request.cookies[env.SESSION_COOKIE_NAME]);
    reply.clearCookie(env.SESSION_COOKIE_NAME, { path: "/" });
    return okMessage(reply, "Logged out");
  });

  app.get("/auth/me", async (request, reply) => {
    if (!request.authUser || !request.authSession) return ok(reply, { user: null, csrfToken: null });
    return ok(reply, { user: authService.toSafeUser(request.authUser), csrfToken: request.authSession.csrfToken });
  });

  app.post("/auth/verify-email", { config: { rateLimit: { max: 20, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(emailTokenSchema, request.body);
    await authService.verifyEmail(body.token);
    return okMessage(reply, "Email verified");
  });

  app.post("/auth/resend-verification", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(resendVerificationSchema, request.body);
    await authService.resendVerification(body.email);
    return okMessage(reply, "If the account exists, a verification email has been sent");
  });

  app.post("/auth/forgot-password", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(forgotPasswordSchema, request.body);
    await authService.forgotPassword(body.email);
    return okMessage(reply, "If the account exists, a password reset email has been sent");
  });

  app.post("/auth/reset-password", { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(resetPasswordSchema, request.body);
    await authService.resetPassword(body.token, body.password);
    return okMessage(reply, "Password reset successful");
  });

  app.post("/auth/change-password", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    const body = parseBody(changePasswordSchema, request.body);
    await authService.changePassword(request.authUser!.id, body.currentPassword, body.newPassword);
    reply.clearCookie(env.SESSION_COOKIE_NAME, { path: "/" });
    return okMessage(reply, "Password changed. Please sign in again.");
  });
}
