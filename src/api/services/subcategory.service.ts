import { subcategoryRepository } from "@/api/repositories/subcategory.repository";
import { createSubcategorySchema, updateSubcategorySchema, } from "@/api/schemas/subcategory.schema";
import { ApiError } from "@/api/utils/api-error";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";

export const subcategoryService = {
    async create(user: any, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN or EDITOR can create subcategories");

        const data = createSubcategorySchema.parse(body);
        const slug = await generateUniqueSlug(
        (slug) => subcategoryRepository.existsBySlug(slug),
            data.name
        );
        return subcategoryRepository.create({
        name: data.name,
        slug: slug,
        category: { connect: { id: data.categoryId } },
        });
    },

    async update(user: any, id: number, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN or EDITOR can update subcategories");

        const data = updateSubcategorySchema.parse(body);

        return subcategoryRepository.update(id, data);
    },

    async delete(user: any, id: number) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN or EDITOR can delete subcategories");

        return subcategoryRepository.delete(id);
    },

    list() {
        return subcategoryRepository.findMany();
    },

    findById(id: number) {
        return subcategoryRepository.findById(id);
    },

    findBySlug(slug: string) {
        return subcategoryRepository.findBySlug(slug);
    },
    search(
        filters: Record<string, any>,
        options?: { page?: number; limit?: number; sortBy?: string; order?: "asc" | "desc" }
    ) {

        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;
        const sortBy = options?.sortBy ?? "name";
        const order = options?.order ?? "asc";

        return subcategoryRepository.findByFilters(filters, { page, limit, sortBy, order });
    }
};