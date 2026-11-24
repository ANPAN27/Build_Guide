import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { ok, okMessage } from "../../utils/http.js";
import { parseParams } from "../../utils/validate.js";
import { requireAuth, requireCsrf } from "../../middleware/auth.js";
import { Errors } from "../../utils/errors.js";

const paramSchema = z.object({ providerId: z.string().uuid() });

export async function favoriteRoutes(app: FastifyInstance) {
  app.get("/favorites", { preHandler: [requireAuth] }, async (request, reply) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: request.authUser!.id, provider: { deletedAt: null } },
      orderBy: { createdAt: "desc" },
      include: { provider: { select: { id: true, displayName: true, specialty: true, city: true, isVerified: true, ratingAverage: true, reviewCount: true } } },
    });
    return ok(reply, { favorites: favorites.map((f) => ({ id: f.id, createdAt: f.createdAt, provider: { ...f.provider, ratingAverage: Number(f.provider.ratingAverage) } })) });
  });

  app.post("/favorites/:providerId", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    const { providerId } = parseParams(paramSchema, request.params);
    const provider = await prisma.providerProfile.findFirst({ where: { id: providerId, deletedAt: null } });
    if (!provider) throw Errors.notFound("Provider not found");
    await prisma.favorite.upsert({ where: { userId_providerId: { userId: request.authUser!.id, providerId } }, create: { userId: request.authUser!.id, providerId }, update: {} });
    return okMessage(reply, "Favorite added", 201);
  });

  app.delete("/favorites/:providerId", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    const { providerId } = parseParams(paramSchema, request.params);
    await prisma.favorite.deleteMany({ where: { userId: request.authUser!.id, providerId } });
    return okMessage(reply, "Favorite removed");
  });
}
