import { QueryBuilder } from "./query.builder";

export class ArticleQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const where: any = {};

    const filters = this.filters;

    if (filters.title) {
      where.OR = [
        { title: { contains: filters.title } },
        { authorName: { contains: filters.title } },
        { author: { name: { contains: filters.title } } },
      ];
    }
    if (filters.lang) where.lang = filters.lang;
    if (filters.categoryId) where.categoryId = Number(filters.categoryId);
    if (filters.subcategoryId) where.subcategories = { some: { id: Number(filters.subcategoryId) } };
    if (filters.authorId) where.authorId = Number(filters.authorId);
    if (filters.tagId) where.tags = { some: { id: Number(filters.tagId) } };
    if (filters.slider) where.slider = filters.slider;
    if (typeof filters.published === "boolean") where.published = filters.published;

    return where;
  }
}