import type { ZodSchema } from "zod";
import { Errors } from "./errors.js";

export function parseBody<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw Errors.badRequest("Validation failed", result.error.flatten());
  return result.data;
}

export function parseQuery<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw Errors.badRequest("Invalid query parameters", result.error.flatten());
  return result.data;
}

export function parseParams<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw Errors.badRequest("Invalid route parameters", result.error.flatten());
  return result.data;
}
