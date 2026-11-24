import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { ok, okMessage } from "../../utils/http.js";
import { parseBody, parseParams, parseQuery } from "../../utils/validate.js";
import { requireAuth, requireCsrf, requireRole } from "../../middleware/auth.js";
import { Errors } from "../../utils/errors.js";

const idParam = z.object({ id: z.string().uuid() });
const verifySchema = z.object({ status: z.enum(["APPROVED", "REJECTED", "PENDING"]), notes: z.string().trim().max(1000).optional().nullable() }).strict();
const auditQuery = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) });
const moderateReviewSchema = z.object({ status: z.enum(["VISIBLE", "HIDDEN", "REMOVED"]), moderationNote: z.string().trim().max(1000).optional().nullable() }).strict();

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("ADMIN"));

  app.get("/admin/users", async (_req, reply) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, take: 100,
      select: { id: true, email: true, name: true, role: true, isEmailVerified: true, createdAt: true, deletedAt: true },
    });
    return ok(reply, { users });
  });

  app.get("/admin/providers/pending", async (_req, reply) => {
    const providers = await prisma.providerProfile.findMany({
      where: { verificationStatus: "PENDING", deletedAt: null },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { email: true, name: true } } },
    });
    return ok(reply, { providers });
  });

  app.post("/admin/providers/:id/verify", { preHandler: [requireCsrf] }, async (request, reply) => {
    const { id } = parseParams(idParam, request.params);
    const body = parseBody(verifySchema, request.body);
    const provider = await prisma.providerProfile.findUnique({ where: { id } });
    if (!provider) throw Errors.notFound("Provider not found");
    const isVerified = body.status === "APPROVED";
    await prisma.$transaction([
      prisma.providerProfile.update({ where: { id }, data: { verificationStatus: body.status, isVerified, verifiedAt: isVerified ? new Date() : null } }),
      prisma.providerVerification.create({ data: { providerId: id, status: body.status, notes: body.notes ?? null, reviewedAt: new Date(), reviewedById: request.authUser!.id } }),
      prisma.auditLog.create({ data: { actorId: request.authUser!.id, action: "PROVIDER_VERIFICATION_UPDATED", entityType: "ProviderProfile", entityId: id, metadata: { status: body.status } } }),
    ]);
    return okMessage(reply, "Verification updated");
  });

  app.get("/admin/reviews", async (_req, reply) => {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" }, take: 100,
      include: { author: { select: { name: true, email: true } }, provider: { select: { displayName: true } } },
    });
    return ok(reply, { reviews });
  });

  app.patch("/admin/reviews/:id/moderate", { preHandler: [requireCsrf] }, async (request, reply) => {
    const { id } = parseParams(idParam, request.params);
    const body = parseBody(moderateReviewSchema, request.body);
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw Errors.notFound("Review not found");
    await prisma.review.update({ where: { id }, data: { status: body.status, moderatedById: request.authUser!.id, moderatedAt: new Date(), moderationNote: body.moderationNote ?? null, deletedAt: body.status === "REMOVED" ? new Date() : review.deletedAt } });
    const agg = await prisma.review.aggregate({ where: { providerId: review.providerId, status: "VISIBLE", deletedAt: null }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.providerProfile.update({ where: { id: review.providerId }, data: { ratingAverage: agg._avg.rating ?? 0, reviewCount: agg._count.rating } });
    return okMessage(reply, "Review moderated");
  });

  app.get("/admin/inquiries", async (_req, reply) => {
    const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { provider: { select: { displayName: true } } } });
    return ok(reply, { inquiries });
  });

  app.get("/admin/audit-logs", async (request, reply) => {
    const query = parseQuery(auditQuery, request.query);
    const [total, items] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, skip: ((query.page ?? 1) - 1) * (query.limit ?? 20), take: query.limit ?? 20, include: { actor: { select: { email: true, name: true } } } }),
    ]);
    return ok(reply, { items, pagination: { page: query.page, limit: query.limit, total } });
  });
}
