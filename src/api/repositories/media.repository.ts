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

    findMany: (opts?: { skip?: number; take?: number }) =>
        prisma.media.findMany({
            orderBy: { createdAt: 'desc' },
            skip: opts?.skip,
            take: opts?.take,
        }),
    count: () => prisma.media.count(),

    delete(id: number) {
        return prisma.media.delete({
        where: { id },
        });
    },
};