import { prisma } from "@/lib/prisma";

export const tagRepository = {
    create(data: any) {
        return prisma.tag.create({ data });
    },

    update(id: number, data: any) {
        return prisma.tag.update({
        where: { id },
        data,
        });
    },

    delete(id: number) {
        return prisma.tag.delete({
        where: { id },
        });
    },

    findMany() {
        return prisma.tag.findMany();
    },

    findById(id: number) {
        return prisma.tag.findUnique({
        where: { id },
        });
    },

    findBySlug(slug: string) {
        return prisma.tag.findUnique({
        where: { slug },
        });
    },
    findByFilters: async (
        filters: Record<string, any>,
        options: { page: number; limit: number; sortBy: string; order: "asc" | "desc" }
    ) => {

        const { page, limit, sortBy, order } = options;

        const where: Record<string, any> = {};

        if (filters.name) {
        where.name = {
            contains: filters.name
        };
        }

        const total = await prisma.tag.count({ where });

        const data = await prisma.tag.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order }
        });

        return {
        data,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
        };
    },
    async existsBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
        where: { slug },
        select: { id: true },
    });
    return !!tag;
    }
};