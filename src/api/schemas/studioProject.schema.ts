import { z } from "zod";
import { socialLinkSchema } from "./socialLink.schema";
import { createLocationSchema } from "./location.schema";

export const ProjectLangEnum = z.enum(["UK", "EN", "PL", "LT", "RO", "MK"]);
export const MarkerTypeEnum  = z.enum(["IMAGEMAPPING", "HISTORICAL", "NATURE"]); 
const locationDataSchema = createLocationSchema.omit({
  projectId: true,
  published: true,
});

export const createStudioProjectSchema = z.object({
  title:    z.string().optional().nullable(),
  title_en: z.string().min(3),
  title_pl: z.string().optional().nullable(),
  title_lt: z.string().optional().nullable(),
  title_ro: z.string().optional().nullable(),
  lang:    ProjectLangEnum.optional(),
  body:    z.any().optional(),
  body_en: z.any().optional(),
  body_pl: z.any().optional(),
  body_lt: z.any().optional(),
  body_ro: z.any().optional(),
  description: z.string().optional(),
  categoryId: z.number(),
  subcategoryId: z.number().optional(),
  imageId: z.number().optional(),
  logoId: z.number().optional(),
  locationId: z.number().optional(),
  locationData: locationDataSchema.optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  parentId: z.number().optional(),
  markerType: MarkerTypeEnum.nullable().optional(), 
  presentationUrl: z.url().optional().nullable(),
  presentationTitle: z.string().optional().nullable(),
  presentationDescription: z.string().optional().nullable(),
  presentationUrl_uk: z.url().optional().nullable(),
  presentationTitle_uk: z.string().optional().nullable(),
  presentationDescription_uk: z.string().optional().nullable(),
});

export const updateStudioProjectSchema = z.object({
  title:    z.string().optional().nullable(),
  title_en: z.string().min(3).optional(),
  title_pl: z.string().optional().nullable(),
  title_lt: z.string().optional().nullable(),
  title_ro: z.string().optional().nullable(),
  lang:     ProjectLangEnum.optional(),
  body:     z.any().optional(),
  body_en:  z.any().optional(),
  body_pl:  z.any().optional(),
  body_lt:  z.any().optional(),
  body_ro:  z.any().optional(),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  subcategoryId: z.number().optional(),
  imageId: z.number().nullable().optional(),
  logoId: z.number().optional(),
  locationId: z.number().optional(),
  locationData: locationDataSchema.optional(),
  deleteLocation: z.boolean().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  parentId: z.number().optional(),
  markerType: MarkerTypeEnum.nullable().optional(),
  presentationUrl: z.url().optional().nullable(),
  presentationTitle: z.string().optional().nullable(),
  presentationDescription: z.string().optional().nullable(),
  presentationUrl_uk: z.url().optional().nullable(),
  presentationTitle_uk: z.string().optional().nullable(),
  presentationDescription_uk: z.string().optional().nullable(),
});

export const publishStudioProjectSchema = z.object({
  id: z.number(),
});