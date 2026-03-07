import { tagService } from "@/api/services/tag.service";

export const tagController = {
    create: (body: any, user: any) =>
        tagService.create(user, body),

    update: (id: number, body: any, user: any) =>
        tagService.update(user, id, body),

    delete: (id: number, user: any) =>
        tagService.delete(user, id),

    list: () =>
        tagService.list(),

    findById: (id: number) =>
        tagService.findById(id),

    findBySlug: (slug: string) =>
        tagService.findBySlug(slug),
    search: (filters: Record<string, any>, query?: any) => {

        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 10);
        const sortBy = query?.sortBy ?? "name";
        const order = query?.order === "desc" ? "desc" : "asc";

        return tagService.search(filters, { page, limit, sortBy, order });
    }
};