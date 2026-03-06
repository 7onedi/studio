import { prisma } from "@/lib/prisma";
import { fi } from "zod/v4/locales";

export const articleRepository = {
    create(data: any) {
        return prisma.article.create({ data });
    },

    update(id: number, data: any) {
        return prisma.article.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.article.delete({ where: { id } });
    },
    
    publish(id: number) {
        return prisma.article.update({
        where: { id },
        data: { published: true, publishedAt: new Date() },
        });
    },

    findBySlug(slug: string) {
        return prisma.article.findUnique({
        where: { slug },
        include: {
            category: true,
            subcategories: true,
            tags: true,
            author: true,
        },
        });
    },

    findById(id: number) {
        return prisma.article.findUnique({
        where: { id },
        include: {
            category: true,
            subcategories: true,
            tags: true,
            author: true,
            image: true,
        },
        });
    },

    findMany(params: any) {
        return prisma.article.findMany(params);
    },

    findByFilters: async (
        filters: Record<string, any>,
        options: {
            page: number;
            limit: number;
            sortBy: string;
            order: "asc" | "desc";
            published?: boolean;
        }
    ) => {

        const { page, limit, sortBy, order, published } = options;

        const where: Record<string, any> = {};

        if (filters.title) {
            where.title = {
                contains: filters.title
            };
        }

        if (filters.lang) {
            where.lang = filters.lang;
        }

        if (filters.categoryId) {
            where.categoryId = Number(filters.categoryId);
        }

        if (filters.subcategoryId) {
            where.subcategories = {
                some: {
                    id: Number(filters.subcategoryId),
                },
            };
        }

        if (typeof published === "boolean") {
            where.published = published;
        }

        const total = await prisma.article.count({ where });

        const data = await prisma.article.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: order },
            include: {
                category: true,
                subcategories: true,
                tags: true,
                image: true,
                author: true,
            },
        });

        return {
            data,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    },

    async existsBySlug(slug: string) {
    const article = await prisma.article.findUnique({
        where: { slug },
        select: { id: true },
    });

    return !!article;
    }
};