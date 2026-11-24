import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";
import { Errors } from "../utils/errors.js";
import { getSession } from "../modules/auth/auth.service.js";

export async function attachSession(request: FastifyRequest) {
  const token = request.cookies[env.SESSION_COOKIE_NAME];
  const session = await getSession(token);
  if (session) {
    request.authUser = session.user;
    request.authSession = session;
  }
}

export async function requireAuth(request: FastifyRequest) {
  if (!request.authUser || !request.authSession) throw Errors.unauthorized();
}

export function requireRole(...roles: Array<"HOMEOWNER" | "PROVIDER" | "ADMIN">) {
  return async (request: FastifyRequest) => {
    if (!request.authUser) throw Errors.unauthorized();
    if (!roles.includes(request.authUser.role)) throw Errors.forbidden();
  };
}

export async function requireVerifiedEmail(request: FastifyRequest) {
  if (!request.authUser) throw Errors.unauthorized();
  if (!request.authUser.isEmailVerified) throw Errors.forbidden("Email verification required");
}

export async function requireCsrf(request: FastifyRequest, reply: FastifyReply) {
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return;
  const header = request.headers["x-csrf-token"];
  const headerValue = Array.isArray(header) ? header[0] : header;
  const session = request.authSession;
  if (!session || !headerValue || headerValue !== session.csrfToken) {
    throw Errors.forbidden("Invalid CSRF token");
  }
  // touch reply to satisfy lint in some configs
  void reply;
}
