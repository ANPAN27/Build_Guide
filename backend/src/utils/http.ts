import type { FastifyReply } from "fastify";

export function ok<T>(reply: FastifyReply, data: T, statusCode = 200) {
  return reply.status(statusCode).send({ data });
}

export function okMessage(reply: FastifyReply, message: string, statusCode = 200) {
  return reply.status(statusCode).send({ data: { message } });
}
