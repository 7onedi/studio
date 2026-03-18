import { prisma } from "@/lib/prisma";

export const mediaRepository = {

    findByUrl(url: string) {
        return prisma.media.findFirst({ where: { url } });
    },

    findById(id: number) {
        return prisma.media.findUnique({ where: { id } });
    },

    create(data: any) {
        return prisma.media.create({ data });
    },

    findMany() {
        return prisma.media.findMany({
        include: { uploader: true },
        orderBy: { createdAt: "desc" },
        });
    },

    delete(id: number) {
        return prisma.media.delete({
        where: { id },
        });
    },
};