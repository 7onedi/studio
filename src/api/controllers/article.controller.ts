import { articleService } from "@/api/services/article.service";

export const articleController = {
    create: (body: any, user: any) => articleService.create(user, body),
    update: (id: number, body: any, user: any) => articleService.update(user, id, body),
    delete: (id: number, user: any) => articleService.delete(user, id),
    publish: (body: any, user: any) => articleService.publish(user, body),
    findById: (id: number) => articleService.findById(id),
    search: (filters: Record<string, any>, options?: any) => {
        return articleService.search(filters, options);
    },
};