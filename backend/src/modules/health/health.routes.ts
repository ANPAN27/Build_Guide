import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (_req, reply) => {
    return reply.send({ status: "ok" });
  });

  app.get("/ready", async (_req, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({ status: "ready" });
    } catch {
      return reply.status(503).send({ status: "not_ready" });
    }
  });
}
