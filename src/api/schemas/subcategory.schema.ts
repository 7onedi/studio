import { z } from "zod";

export const createSubcategorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name too long"),

    categoryId: z
        .number()
        .int("Category ID must be a number")
        .positive("Category is required"),
});

export const updateSubcategorySchema = z.object({
    name: z
        .string()
        .min(2)
        .max(100)
        .optional(),

    categoryId: z
        .number()
        .int()
        .positive()
        .optional(),
});