import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(2),
});

export const updateCategorySchema = z.object({
    id: z.number(),
    name: z.string().min(2).optional(),
});