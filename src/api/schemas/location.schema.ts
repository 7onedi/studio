import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1, "Назва локації обов'язкова"),
  url: z.string().url("Повинен бути валідний URL"),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  description: z.string().optional(),
  projectId: z.number().optional(),
  published: z.boolean().optional(),
});

export const updateLocationSchema = createLocationSchema.partial();