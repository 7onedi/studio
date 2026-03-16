import { categoryService } from "@/api/services/category.service";

export const categoryController = {
    create: async (body: any, user: any) => categoryService.create(user, body),
    update: async (id: number, body: any, user: any) => categoryService.update(user, id, body),
    delete: async (id: number, user: any) => categoryService.delete(user, id),
    list: async () => categoryService.list(),
    findById: async (id: number) => categoryService.findById(id),
    findBySlug: async (slug: string) => categoryService.findBySlug(slug),
    search: (filters: Record<string, any>, options?: any) => {
        return categoryService.search(filters, options);
    },
};