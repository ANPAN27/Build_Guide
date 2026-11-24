import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(150).optional().nullable(),
  body: z.string().trim().min(5).max(2000),
}).strict();

export const reviewParamSchema = z.object({ id: z.string().uuid() });
export const providerParamSchema = z.object({ providerId: z.string().uuid() });
