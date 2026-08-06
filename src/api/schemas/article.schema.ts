import { z } from "zod";

export const ArticleLangEnum = z.enum(["UK", "EN", "PL", "LT", "RO"]);
export const ArticleSliderEnum = z.enum(["NONE", "SLIDER_1", "SLIDER_2", "SLIDER_3"]);
export const ArticleGradientEnum = z.enum(["NONE", "GRADIENT_1", "GRADIENT_2"]);

const baseArticleFields = {
  title: z.string().trim().min(3, "Minimum 3 characters").max(200, "Maximum 200 characters"),
  lang: ArticleLangEnum,
  slider: ArticleSliderEnum.optional(),
  gradient: ArticleGradientEnum.optional(),
  body: z.any(),
  authorName: z.string().trim().min(2, "Minimum 2 characters").max(64, "Maximum 64 characters"),
  authorAvatarId: z.number().int().positive().nullable().optional(),
  categoryId: z.number().int().positive("Please select a category"),
  subcategoryIds: z.array(z.number().int().positive()).optional(),
  currentImageId: z.number().int().positive("Banner is required"),
  tags: z.array(z.object({ name: z.string().trim().min(1) })).optional(),
  published: z.boolean().optional(),
};

export const createArticleSchema = z.object(baseArticleFields);
export const updateArticleSchema = z.object(baseArticleFields).partial();

export const publishArticleSchema = z.object({
  id: z.number().int().positive(),
});