import type { Session, User } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: User;
    authSession?: Session;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export {};
