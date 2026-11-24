import type { FastifyInstance } from "fastify";
import { ok, okMessage } from "../../utils/http.js";
import { parseBody, parseParams } from "../../utils/validate.js";
import { requireAuth, requireCsrf, requireRole } from "../../middleware/auth.js";
import { createReviewSchema, providerParamSchema, reviewParamSchema } from "./reviews.schemas.js";
import * as svc from "./reviews.service.js";

export async function reviewRoutes(app: FastifyInstance) {
  app.get("/providers/:providerId/reviews", async (request, reply) => {
    const { providerId } = parseParams(providerParamSchema, request.params);
    return ok(reply, { reviews: await svc.listProviderReviews(providerId) });
  });

  app.post("/providers/:providerId/reviews", { preHandler: [requireAuth, requireRole("HOMEOWNER", "ADMIN"), requireCsrf], config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const { providerId } = parseParams(providerParamSchema, request.params);
    const body = parseBody(createReviewSchema, request.body);
    const review = await svc.createReview(providerId, request.authUser!.id, body);
    return ok(reply, { review }, 201);
  });

  app.delete("/reviews/:id", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    const { id } = parseParams(reviewParamSchema, request.params);
    await svc.deleteOwnReview(id, request.authUser!.id);
    return okMessage(reply, "Review removed");
  });
}
