import { subcategoryService } from "@/api/services/subcategory.service";

export const subcategoryController = {
    create: (body: any, user: any) =>
        subcategoryService.create(user, body),

    update: (id: number, body: any, user: any) =>
        subcategoryService.update(user, id, body),

    delete: (id: number, user: any) =>
        subcategoryService.delete(user, id),

    list: () =>
        subcategoryService.list(),

    findById: (id: number) =>
        subcategoryService.findById(id),

    findBySlug: (slug: string) =>
        subcategoryService.findBySlug(slug),
    search: (filters: Record<string, any>, query?: any) => {

        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 10);
        const sortBy = query?.sortBy ?? "name";
        const order = query?.order === "desc" ? "desc" : "asc";

        return subcategoryService.search(filters, { page, limit, sortBy, order });
    }
};