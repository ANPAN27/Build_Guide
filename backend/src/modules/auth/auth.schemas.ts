import { z } from "zod";

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");

const email = z.string().trim().toLowerCase().email().max(254);
const name = z.string().trim().min(2).max(100);
const phone = z.string().trim().min(7).max(20).optional().or(z.literal(""));

export const registerSchema = z.object({
  name,
  email,
  password: passwordSchema,
  phone,
});

export const providerRegisterSchema = registerSchema.extend({
  specialty: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  experienceYears: z.coerce.number().int().min(0).max(80),
  bio: z.string().trim().max(2000).optional().default(""),
  rateRange: z.string().trim().max(100).optional().default(""),
  services: z.array(z.string().trim().min(2).max(100)).max(20).optional().default([]),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const emailTokenSchema = z.object({ token: z.string().min(16).max(256) });
export const resendVerificationSchema = z.object({ email });
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({ token: z.string().min(16).max(256), password: passwordSchema });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: passwordSchema });

export type RegisterInput = z.infer<typeof registerSchema>;
export type ProviderRegisterInput = z.infer<typeof providerRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
