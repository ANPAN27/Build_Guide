import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import prismaPlugin from "./plugins/prisma.js";
import { attachSession, requireCsrf } from "./middleware/auth.js";
import { AppError } from "./utils/errors.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { providerRoutes } from "./modules/providers/providers.routes.js";
import { reviewRoutes } from "./modules/reviews/reviews.routes.js";
import { favoriteRoutes } from "./modules/favorites/favorites.routes.js";
import { inquiryRoutes } from "./modules/inquiries/inquiries.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { estimateRoutes } from "./modules/estimates/estimates.routes.js";

export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    trustProxy: env.TRUST_PROXY,
    disableRequestLogging: false,
    ajv: { customOptions: { removeAdditional: false } },
  });

  await app.register(sensible);
  await app.register(cookie, { secret: env.SESSION_SECRET, hook: "onRequest" });
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || env.frontendOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token", "X-Request-Id"],
  });
  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: env.isProd ? undefined : false,
  });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    ban: 0,
  });
  await app.register(prismaPlugin);

  await app.register(swagger, {
    openapi: {
      info: { title: "Build Guide API", version: "1.0.0" },
      servers: [{ url: env.API_BASE_URL }],
    },
  });
  await app.register(swaggerUi, { routePrefix: "/api/v1/docs", staticCSP: true });

  app.addHook("onRequest", attachSession);
  app.addHook("preHandler", requireCsrf);

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(400).send({ error: { code: "VALIDATION_ERROR", message: "Validation failed", details: err.flatten() } });
    }
    if (err instanceof AppError) {
      const payload: { error: { code: string; message: string; details?: unknown } } = { error: { code: err.code, message: err.message } };
      if (err.details && env.NODE_ENV !== "production") payload.error.details = err.details;
      if (err.details && env.NODE_ENV === "production" && err.statusCode === 400) payload.error.details = err.details;
      return reply.status(err.statusCode).send(payload);
    }
    const maybeStatus = (err as { statusCode?: number; message?: string }).statusCode;
    if (maybeStatus === 429) {
      return reply.status(429).send({ error: { code: "TOO_MANY_REQUESTS", message: "Too many requests" } });
    }
    if ((err as { message?: string }).message === "Origin not allowed") {
      return reply.status(403).send({ error: { code: "CORS_ORIGIN_DENIED", message: "Origin not allowed" } });
    }
    req.log.error({ err }, "Unhandled error");
    return reply.status(500).send({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  });

  app.get("/", async () => ({ name: "Build Guide API", status: "ok" }));

  await app.register(async (v1) => {
    await v1.register(healthRoutes);
    await v1.register(authRoutes);
    await v1.register(usersRoutes);
    await v1.register(providerRoutes);
    await v1.register(reviewRoutes);
    await v1.register(favoriteRoutes);
    await v1.register(inquiryRoutes);
    await v1.register(adminRoutes);
    await v1.register(estimateRoutes);
  }, { prefix: "/api/v1" });

  return app;
}
