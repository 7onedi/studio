import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.url("URL must be a valid").nullable().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
      zoom: z.number().optional(),
    })
    .optional(),
  description: z.string().optional(),
  projectId: z.number().optional(),
  published: z.boolean().optional(),
});

export const updateLocationSchema = createLocationSchema.partial();