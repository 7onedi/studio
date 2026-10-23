import { prisma } from "@/lib/prisma";
import type { MediaWhere } from "@/api/controllers/media.controller";

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

    findMany: (opts?: { skip?: number; take?: number; where?: MediaWhere }) =>
        prisma.media.findMany({
            where: opts?.where,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            skip: opts?.skip,
            take: opts?.take,
        }),
    count: (where?: MediaWhere) => prisma.media.count({ where }),

    delete(id: number) {
        return prisma.media.delete({
        where: { id },
        });
    },

    async pageOf(id: number, limit: number) {
        const m = await prisma.media.findUnique({ where: { id }, select: { createdAt: true } });
        if (!m) return 1;
        const ahead = await prisma.media.count({
            where: { OR: [{ createdAt: { gt: m.createdAt } }, { createdAt: m.createdAt, id: { gt: id } }] },
        });
        return Math.floor(ahead / limit) + 1;
    }
};