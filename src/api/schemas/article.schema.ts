import { z } from "zod";

export const ArticleLangEnum = z.enum(["UK", "EN", "PL", "LT" ,"RO"]);

export const createArticleSchema = z.object({
  title: z.string().min(3),
  lang: ArticleLangEnum,
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