import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { ok, okMessage } from "../../utils/http.js";
import { parseBody, parseParams } from "../../utils/validate.js";
import { requireAuth, requireCsrf, requireRole } from "../../middleware/auth.js";
import { Errors } from "../../utils/errors.js";
import { createInquirySchema, inquiryIdSchema, updateInquiryStatusSchema } from "./inquiries.schemas.js";

export async function inquiryRoutes(app: FastifyInstance) {
  app.post("/inquiries", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const body = parseBody(createInquirySchema, request.body);
    const provider = await prisma.providerProfile.findFirst({ where: { id: body.providerId, deletedAt: null } });
    if (!provider) throw Errors.notFound("Provider not found");
    const inquiry = await prisma.contactInquiry.create({
      data: {
        providerId: body.providerId,
        homeownerId: request.authUser?.id ?? null,
        name: body.name, email: body.email, phone: body.phone ?? null, message: body.message,
      },
      select: { id: true, status: true, createdAt: true },
    });
    return ok(reply, { inquiry }, 201);
  });

  app.get("/inquiries/me", { preHandler: [requireAuth, requireRole("PROVIDER")] }, async (request, reply) => {
    const provider = await prisma.providerProfile.findUnique({ where: { userId: request.authUser!.id } });
    if (!provider) throw Errors.notFound("Provider profile not found");
    const inquiries = await prisma.contactInquiry.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, phone: true, message: true, status: true, createdAt: true, respondedAt: true },
    });
    return ok(reply, { inquiries });
  });

  app.patch("/inquiries/:id/status", { preHandler: [requireAuth, requireRole("PROVIDER", "ADMIN"), requireCsrf] }, async (request, reply) => {
    const { id } = parseParams(inquiryIdSchema, request.params);
    const body = parseBody(updateInquiryStatusSchema, request.body);
    const inquiry = await prisma.contactInquiry.findUnique({ where: { id }, include: { provider: true } });
    if (!inquiry) throw Errors.notFound("Inquiry not found");
    if (request.authUser!.role === "PROVIDER" && inquiry.provider.userId !== request.authUser!.id) throw Errors.forbidden();
    await prisma.contactInquiry.update({
      where: { id },
      data: { status: body.status, respondedAt: body.status === "RESPONDED" ? new Date() : inquiry.respondedAt, respondedById: request.authUser!.id },
    });
    return okMessage(reply, "Inquiry updated");
  });
}
