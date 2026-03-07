import { articleService } from "@/api/services/article.service";

export const articleController = {
    create: (body: any, user: any) => articleService.create(user, body),
    update: (id: number, body: any, user: any) => articleService.update(user, id, body),
    delete: (id: number, user: any) => articleService.delete(user, id),
    publish: (body: any, user: any) => articleService.publish(user, body),
    findById: (id: number) => articleService.findById(id),
    search: (filters: Record<string, any>, query?: any) => {
        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 10);
        const sortBy = query?.sortBy ?? "createdAt";
        const order = query?.order === "asc" ? "asc" : "desc";
        const published = query?.published === "true" ? true : query?.published === "false" ? false : undefined;

        return articleService.search(filters, { page, limit, sortBy, order, published });
    },
};