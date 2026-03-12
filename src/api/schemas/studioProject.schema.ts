import { z } from "zod";

export const createStudioProjectSchema = z.object({
  title: z.string().min(3),
  body: z.any().optional(),
  description: z.string().optional(),
  categoryId: z.number(),
  subcategoryId: z.number().optional(),
  imageId: z.number().optional(),
  locationId: z.number().optional(),
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
  parentId: z.number().optional(),
});

export const publishStudioProjectSchema = z.object({
  id: z.number(),
});