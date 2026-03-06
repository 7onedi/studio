import { categoryRepository } from "@/api/repositories/category.repository";
import { createCategorySchema, updateCategorySchema } from "@/api/schemas/category.schema";
import { ApiError } from "@/api/utils/api-error";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";

export const categoryService = {
    async create(user: any, body: unknown) {
        if (!user || user.role !== "ADMIN" && user.role !== "EDITOR") throw new ApiError(403, "Only ADMIN or EDITOR can create category");
        const data = createCategorySchema.parse(body);
        const slug = await generateUniqueSlug(
        (slug) => categoryRepository.existsBySlug(slug),
            data.name
        );
        return categoryRepository.create({ ...data, slug });
    },

    async update(user: any, body: unknown) {
        if (!user || user.role !== "ADMIN" && user.role !== "EDITOR") throw new ApiError(403, "Only ADMIN or EDITOR can update category");
        const data = updateCategorySchema.parse(body);
        return categoryRepository.update(data.id, data);
    },

    async delete(user: any, id: number) {
        if (!user || user.role !== "ADMIN" && user.role !== "EDITOR") throw new ApiError(403, "Only ADMIN or EDITOR can delete category");
        return categoryRepository.delete(id);
    },

    async list() {
        return categoryRepository.findAll();
    },

    async findById(id: number) {
        return categoryRepository.findById(id);
    },

    async findBySlug(slug: string) {
        return categoryRepository.findBySlug(slug);
    },
    search(filters: Record<string, any>, options?: any) {

        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;
        const sortBy = options?.sortBy ?? "name";
        const order = options?.order ?? "asc";

        return categoryRepository.findByFilters(filters, {
        page,
        limit,
        sortBy,
        order
        });
    }
};