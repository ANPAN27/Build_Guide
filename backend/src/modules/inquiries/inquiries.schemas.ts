import { z } from "zod";

export const createInquirySchema = z.object({
  providerId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(20).optional().nullable(),
  message: z.string().trim().min(10).max(2000),
}).strict();

export const inquiryIdSchema = z.object({ id: z.string().uuid() });
export const updateInquiryStatusSchema = z.object({ status: z.enum(["OPEN", "RESPONDED", "CLOSED"]) }).strict();
