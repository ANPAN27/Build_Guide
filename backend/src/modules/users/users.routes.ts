import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { ok } from "../../utils/http.js";
import { parseBody } from "../../utils/validate.js";
import { requireAuth, requireCsrf } from "../../middleware/auth.js";
import { updateMeSchema } from "./users.schemas.js";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users/me", { preHandler: [requireAuth] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.authUser!.id },
      select: { id: true, email: true, name: true, phone: true, role: true, isEmailVerified: true, createdAt: true },
    });
    return ok(reply, { user });
  });

  app.patch("/users/me", { preHandler: [requireAuth, requireCsrf] }, async (request, reply) => {
    const body = parseBody(updateMeSchema, request.body);
    const user = await prisma.user.update({
      where: { id: request.authUser!.id },
      data: { name: body.name, phone: body.phone === "" ? null : body.phone },
      select: { id: true, email: true, name: true, phone: true, role: true, isEmailVerified: true, createdAt: true },
    });
    return ok(reply, { user });
  });
}
