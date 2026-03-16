import { mediaService } from "@/api/services/media.service";

export const mediaController = {
    upload: (user: any, file: File) =>
        mediaService.upload(user, file),

    list: () =>
        mediaService.list(),

    delete: (user: any, id: number) =>
        mediaService.delete(user, id),
};