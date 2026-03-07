import { prisma } from "@/lib/prisma";

export const subcategoryRepository = {
    create(data: any) {
        return prisma.subcategory.create({ data });
    },

    update(id: number, data: any) {
        return prisma.subcategory.update({
        where: { id },
        data,
        });
    },

    delete(id: number) {
        return prisma.subcategory.delete({
        where: { id },
        });
    },

    findMany() {
        return prisma.subcategory.findMany({
        include: { category: true },
        });
    },

    findById(id: number) {
        return prisma.subcategory.findUnique({
        where: { id },
        include: { category: true },
        });
    },

    findBySlug(slug: string) {
        return prisma.subcategory.findFirst({
        where: { slug },
        include: { category: true },
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

        if (filters.categoryId) {
        where.categoryId = Number(filters.categoryId);
        }

        const total = await prisma.subcategory.count({ where });

        const data = await prisma.subcategory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
            category: true
        }
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
    const subcategory = await prisma.subcategory.findFirst({
        where: { slug },
        select: { id: true },
    });
    return !!subcategory;
    }
};