import { z } from "zod";
import { sl } from "zod/v4/locales";

export const ArticleLangEnum = z.enum(["UK", "EN", "PL", "LT" ,"RO"]);
export const ArticleSliderEnum = z.enum(["NONE", "SLIDER_1", "SLIDER_2", "SLIDER_3"]).optional();
export const ArticleGradient = z.enum(["NONE", "GRADIENT_1", "GRADIENT_2"]).optional();

export const createArticleSchema = z.object({
  title: z.string().min(3),
  lang: ArticleLangEnum,
  slider: ArticleSliderEnum,
  gradient: ArticleGradient,
  body: z.any(), // JSON від EditorJS
  authorName: z.string().min(2),
  categoryId: z.number(),
  subcategoryIds: z.array(z.number()).optional(),
  imageId: z.number().optional(),
  tags: z.array(
    z.object({
      name: z.string(),
    })
  ).optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(3).optional(),
  lang: ArticleLangEnum.optional(),
  slider: ArticleSliderEnum.optional(),
  gradient: ArticleGradient.optional(),
  body: z.any().optional(), // JSON від EditorJS
  authorName: z.string().min(2).optional(),
  categoryId: z.number().optional(),
  subcategoryIds: z.array(z.number()).optional(),
  imageId: z.number().optional(),
  tags: z.array(
    z.object({
      name: z.string(),
    })
  ).optional(),
});

export const publishArticleSchema = z.object({
  id: z.number(),
});