import { articleRepository } from "@/api/repositories/article.repository";
import { createArticleSchema, updateArticleSchema, publishArticleSchema } from "@/api/schemas/article.schema";
import { canCreateArticle, canPublish } from "@/api/utils/permissions";
import { ApiError } from "@/api/utils/api-error";
import { da } from "zod/v4/locales";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";
import { tagRepository } from "@/api/repositories/tag.repository";

export const articleService = {
    async create(user: any, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");

        if (!canCreateArticle(user.role))
            throw new ApiError(403, "Forbidden: Only EDITOR or ADMIN can create articles");

        const data = createArticleSchema.parse(body);

        const slug = await generateUniqueSlug(
            (slug) => articleRepository.existsBySlug(slug),
            data.title
        );

        return articleRepository.create({
            slug,
            title: data.title,
            lang: data.lang,
            body: data.body,
            authorName: data.authorName,
            author: { connect: { id: user.id } },
            category: { connect: { id: data.categoryId } },
            subcategories: {
            connect: data.subcategoryIds?.map((id) => ({ id })),
            },
            tags: {
            connectOrCreate: await Promise.all(data.tags?.map(async (tag) => {
                const slug = await generateUniqueSlug(
                (slug) => tagRepository.existsBySlug(slug),
                tag.name
                );

                return {
                where: { slug }, // Prisma спробує під’єднати існуючий тег
                create: { name: tag.name, slug },
                };
            }) || []),
            },
        });
    },

    async update(user: any, articleId: number, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!canCreateArticle(user.role))
            throw new ApiError(403, "Forbidden: Only EDITOR or ADMIN can edit articles");

        const data = updateArticleSchema.partial().parse(body);

        let tagsConnectOrCreate;
        if (data.tags) {
            tagsConnectOrCreate = await Promise.all(
            data.tags.map(async (tag) => {
                const slug = await generateUniqueSlug(
                (slug) => tagRepository.existsBySlug(slug),
                tag.name
                );

                return {
                where: { slug },
                create: { name: tag.name, slug },
                };
            })
            );
        }

        return articleRepository.update(articleId, {
            ...data,
            ...(tagsConnectOrCreate ? { tags: { connectOrCreate: tagsConnectOrCreate } } : {}),
        });
    },

    async delete(user: any, articleId: number) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN") throw new ApiError(403, "Forbidden: Only ADMIN can delete articles");

        return articleRepository.delete(articleId);
    },

    async publish(user: any, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!canPublish(user.role)) throw new ApiError(403, "Forbidden: Only ADMIN can publish articles");

        const data = publishArticleSchema.parse(body);
        return articleRepository.publish(data.id);
    },

    findById(id: number) {
        return articleRepository.findById(id);
    },

    search(
        filters: Record<string, any>,
        options?: { page?: number; limit?: number; sortBy?: string; order?: "asc" | "desc"; published?: boolean }
        ) {
        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;
        const sortBy = options?.sortBy ?? "createdAt";
        const order = options?.order ?? "desc";
        const published = options?.published;

        return articleRepository.findByFilters(filters, { page, limit, sortBy, order, published });
    }
};