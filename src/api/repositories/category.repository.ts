import { prisma } from "@/lib/prisma";

export const categoryRepository = {
    create(data: any) {
        return prisma.category.create({ data });
    },

    update(id: number, data: any) {
        return prisma.category.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.category.delete({ where: { id } });
    },

    findAll() {
        return prisma.category.findMany();
    },

    findById(id: number) {
        return prisma.category.findUnique({ where: { id } });
    },

    findBySlug(slug: string) {
        return prisma.category.findUnique({ where: { slug } });
    },
    async existsBySlug(slug: string) {
    const category = await prisma.category.findUnique({
        where: { slug },
        select: { id: true },
    });
    return !!category;
    },
    findByFilters: async (
        filters: Record<string, any>,
        options: { page: number; limit: number; sortBy: string; order: "asc" | "desc" }
    ) => {

        const { page, limit, sortBy, order } = options;

        const where: any = {};

        if (filters.name) {
        where.name = {
            contains: filters.name
        };
        }

        const total = await prisma.category.count({ where });

        const data = await prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
            subcategories: true
        }
        });

        return {
        data,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
        };
    }
};