import type { FastifyInstance } from "fastify";
import { ok, okMessage } from "../../utils/http.js";
import { parseBody, parseParams, parseQuery } from "../../utils/validate.js";
import { requireAuth, requireCsrf, requireRole } from "../../middleware/auth.js";
import {
  providerListQuerySchema, providerIdParamSchema, updateProviderProfileSchema,
  serviceSchema, serviceIdParamSchema, portfolioSchema, portfolioIdParamSchema,
} from "./providers.schemas.js";
import * as svc from "./providers.service.js";

export async function providerRoutes(app: FastifyInstance) {
  app.get("/providers", async (request, reply) => {
    const query = parseQuery(providerListQuerySchema, request.query);
    return ok(reply, await svc.listProviders({ ...query, sort: query.sort ?? "rating", page: query.page ?? 1, limit: query.limit ?? 12 }));
  });

  app.get("/providers/:id", async (request, reply) => {
    const { id } = parseParams(providerIdParamSchema, request.params);
    return ok(reply, { provider: await svc.getProviderById(id) });
  });

  app.get("/providers/me/profile", { preHandler: [requireAuth, requireRole("PROVIDER")] }, async (request, reply) => {
    return ok(reply, { provider: await svc.getMyProviderProfile(request.authUser!.id) });
  });

  app.patch("/providers/me/profile", { preHandler: [requireAuth, requireRole("PROVIDER"), requireCsrf] }, async (request, reply) => {
    const body = parseBody(updateProviderProfileSchema, request.body);
    return ok(reply, { provider: await svc.updateMyProviderProfile(request.authUser!.id, body) });
  });

  app.post("/providers/me/services", { preHandler: [requireAuth, requireRole("PROVIDER"), requireCsrf] }, async (request, reply) => {
    const body = parseBody(serviceSchema, request.body);
    return ok(reply, { service: await svc.addService(request.authUser!.id, body.name, body.description) }, 201);
  });

  app.delete("/providers/me/services/:serviceId", { preHandler: [requireAuth, requireRole("PROVIDER"), requireCsrf] }, async (request, reply) => {
    const { serviceId } = parseParams(serviceIdParamSchema.pick({ serviceId: true }), request.params);
    await svc.removeService(request.authUser!.id, serviceId);
    return okMessage(reply, "Service removed");
  });

  app.post("/providers/me/portfolio", { preHandler: [requireAuth, requireRole("PROVIDER"), requireCsrf] }, async (request, reply) => {
    const body = parseBody(portfolioSchema, request.body);
    return ok(reply, { item: await svc.addPortfolio(request.authUser!.id, body) }, 201);
  });

  app.delete("/providers/me/portfolio/:portfolioId", { preHandler: [requireAuth, requireRole("PROVIDER"), requireCsrf] }, async (request, reply) => {
    const { portfolioId } = parseParams(portfolioIdParamSchema.pick({ portfolioId: true }), request.params);
    await svc.removePortfolio(request.authUser!.id, portfolioId);
    return okMessage(reply, "Portfolio item removed");
  });
}
