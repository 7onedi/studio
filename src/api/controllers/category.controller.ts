import { categoryService } from "@/api/services/category.service";

export const categoryController = {
    create: async (body: any, user: any) => categoryService.create(user, body),
    update: async (body: any, user: any) => categoryService.update(user, body),
    delete: async (id: number, user: any) => categoryService.delete(user, id),
    list: async () => categoryService.list(),
    findById: async (id: number) => categoryService.findById(id),
    findBySlug: async (slug: string) => categoryService.findBySlug(slug),
    search: (filters: Record<string, any>, query?: any) => {

        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 10);
        const sortBy = query?.sortBy ?? "name";
        const order = query?.order === "desc" ? "desc" : "asc";

        return categoryService.search(filters, { page, limit, sortBy, order });
    }
};