import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { ArticleQueryBuilder } from "@/api/builders/article.query.builder";

const crud = CrudConcern(prisma.article);
const search = SearchConcern(prisma.article, ArticleQueryBuilder);

export const articleRepository = {
  ...crud,
  ...search,

  async publish(id: number) {
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
      select: { published: true },
    });

    return prisma.article.update({
      where: { id },
      data: {
        published: !article.published,
        publishedAt: !article.published ? new Date() : null,
      },
    });
  },

  findById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug },
      include: { category: true, subcategories: true, tags: true, author: true, image: true },
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