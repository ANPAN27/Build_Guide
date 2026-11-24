import { z } from "zod";

export const providerListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  specialty: z.string().trim().max(100).optional(),
  verified: z.enum(["true", "false"]).optional(),
  minExperience: z.coerce.number().int().min(0).max(80).optional(),
  sort: z.enum(["rating", "experience", "newest"]).optional().default("rating"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const providerIdParamSchema = z.object({ id: z.string().uuid() });

export const updateProviderProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(100).optional(),
  specialty: z.string().trim().min(2).max(100).optional(),
  city: z.string().trim().min(2).max(100).optional(),
  experienceYears: z.coerce.number().int().min(0).max(80).optional(),
  bio: z.string().trim().max(2000).optional(),
  rateRange: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().min(7).max(20).optional().nullable(),
  whatsapp: z.string().trim().min(7).max(20).optional().nullable(),
  publicEmail: z.string().trim().email().max(254).optional().nullable(),
  website: z.string().trim().url().max(500).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
}).strict();

export const serviceSchema = z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(500).optional().nullable() }).strict();
export const serviceIdParamSchema = z.object({ id: z.string().uuid(), serviceId: z.string().uuid() });
export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  imageUrl: z.string().trim().url().max(1000).optional().nullable(),
}).strict();
export const portfolioIdParamSchema = z.object({ id: z.string().uuid(), portfolioId: z.string().uuid() });
