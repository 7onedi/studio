import { mediaService } from "@/api/services/media.service";
import { prisma } from "@/lib/prisma";
import { mediaCropService, cropsSchema } from "@/api/services/media-crop.service";
import type { z } from "zod";

export type MediaWhere = NonNullable<Parameters<typeof prisma.media.findMany>[0]>['where'];

export const mediaController = {
    upload: (user: any, file: File) =>
        mediaService.upload(user, file),
    list: (page?: number, limit?: number, where?: MediaWhere, focusId?: number) =>
        mediaService.list(page, limit, where, focusId),
    delete: (user: any, id: number) =>
        mediaService.delete(user, id),
    findByUrl: (url: string) =>
        mediaService.findByUrl(url),
    findById: (id: number) =>
        mediaService.findById(id),
    setCrops: (id: number, crops: z.infer<typeof cropsSchema>) =>
        mediaCropService.setCrops(id, crops),
};