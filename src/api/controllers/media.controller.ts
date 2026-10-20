import { mediaService } from "@/api/services/media.service";
import { prisma } from "@/lib/prisma";

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
};