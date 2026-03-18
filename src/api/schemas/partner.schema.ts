import { z } from "zod";

export const createPartnerSchema = z.object({
  name:        z.string().min(1, "Ім'я обов'язкове"),
  email:       z.string().email("Невалідний email"),
  role:        z.enum(["PARTNER", "MEMBER", "DONOR"]),
  description: z.string().optional(),
  imageId:     z.number().optional(),
});

export const updatePartnerSchema = createPartnerSchema.partial();

export const updatePartnerStatusSchema = z.object({
  id:     z.number(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const publishPartnerSchema = z.object({
  id: z.number(),
});