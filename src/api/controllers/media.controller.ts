import { mediaService } from "@/api/services/media.service";

export const mediaController = {
    upload: (user: any, file: File) =>
        mediaService.upload(user, file),

    list: (page?: number, limit?: number) => 
        mediaService.list(page, limit),

    delete: (user: any, id: number) =>
        mediaService.delete(user, id),
    findByUrl: (url: string) =>
        mediaService.findByUrl(url),
    findById: (id: number) =>
        mediaService.findById(id),
};