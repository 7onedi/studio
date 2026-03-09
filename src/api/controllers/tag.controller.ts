import { tagService } from "@/api/services/tag.service";

export const tagController = {
    create: (body: any, user: any) => tagService.create(user, body),
    update: (id: number, body: any, user: any) => tagService.update(user, id, body),
    delete: (id: number, user: any) => tagService.delete(user, id),
    list: () => tagService.list(),
    findById: (id: number) => tagService.findById(id),
    findBySlug: (slug: string) => tagService.findBySlug(slug),
    search: (filters: Record<string, any>, options?: any) => {
        return tagService.search(filters, options);
    },
};