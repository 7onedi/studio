import { tagRepository } from "@/api/repositories/tag.repository";
import { createTagSchema, updateTagSchema } from "@/api/schemas/tag.schema";
import { ApiError } from "@/api/utils/api-error";
import { generateUniqueSlug } from "../utils/generate-unique-slug";

export const tagService = {
    async create(user: any, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN and EDITOR can create tags");

        const data = createTagSchema.parse(body);
        const slug = await generateUniqueSlug(
        (slug) => tagRepository.existsBySlug(slug),
            data.name
        );
        return tagRepository.create({ ...data, slug });
    },

    async update(user: any, id: number, body: unknown) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN and EDITOR can update tags");

        const data = updateTagSchema.parse(body);

        return tagRepository.update(id, data);
    },

    async delete(user: any, id: number) {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (user.role !== "ADMIN" && user.role !== "EDITOR")
        throw new ApiError(403, "Only ADMIN and EDITOR can delete tags");

        return tagRepository.delete(id);
    },

    list() {
        return tagRepository.findMany();
    },

    findById(id: number) {
        return tagRepository.findById(id);
    },

    findBySlug(slug: string) {
        return tagRepository.findBySlug(slug);
    },
    search(
        filters: Record<string, any>,
        options?: { page?: number; limit?: number; sortBy?: string; order?: "asc" | "desc" }
    ) {

        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;
        const sortBy = options?.sortBy ?? "name";
        const order = options?.order ?? "asc";

        return tagRepository.findByFilters(filters, { page, limit, sortBy, order });
    }
};