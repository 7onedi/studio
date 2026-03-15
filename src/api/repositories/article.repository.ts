import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { ArticleQueryBuilder } from "@/api/builders/article.query.builder";

const crud = CrudConcern(prisma.article);
const search = SearchConcern(prisma.article, ArticleQueryBuilder);

export const articleRepository = {
  ...crud,
  ...search,

  publish(id: number) {
    return prisma.article.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
    });
  },

  findBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug },
      include: { category: true, subcategories: true, tags: true, author: true },
    });
  },

  async existsBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!article;
  },

  async  update(id: number, data: any) {
      return prisma.article.update({
        where: { id },
        data,
        include: {
          category: true,
          subcategories: true,
          tags: true,
          author: true,
        },
      });
    }
};