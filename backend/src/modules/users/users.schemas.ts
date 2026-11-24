import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")).optional(),
}).strict();
