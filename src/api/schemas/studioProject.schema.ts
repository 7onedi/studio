import { z } from "zod";
import { socialLinkSchema } from "./socialLink.schema";
import { createLocationSchema } from "./location.schema";

const locationDataSchema = createLocationSchema.omit({
  projectId: true,
  published: true,
});

export const createStudioProjectSchema = z.object({
  title: z.string().min(3),
  body: z.any().optional(),
  description: z.string().optional(),
  categoryId: z.number(),
  subcategoryId: z.number().optional(),
  imageId: z.number().optional(),
  // locationId — для connect до існуючої; locationData — для створення нової
  locationId: z.number().optional(),
  locationData: locationDataSchema.optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  parentId: z.number().optional(),
});

export const updateStudioProjectSchema = z.object({
  title: z.string().min(3).optional(),
  body: z.any().optional(),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  subcategoryId: z.number().optional(),
  imageId: z.number().optional(),
  locationId: z.number().optional(),
  locationData: locationDataSchema.optional(),
  // null = видалити location
  deleteLocation: z.boolean().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  parentId: z.number().optional(),
});

export const publishStudioProjectSchema = z.object({
  id: z.number(),
});