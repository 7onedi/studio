import { QueryBuilder } from "./query.builder";

export class ArticleQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const where: any = {};

    const filters = this.filters;

    if (filters.title) where.title = { contains: filters.title };
    if (filters.lang) where.lang = filters.lang;
    if (filters.categoryId) where.categoryId = Number(filters.categoryId);
    if (filters.subcategoryId) where.subcategories = { some: { id: Number(filters.subcategoryId) } };
    if (typeof filters.published === "boolean") where.published = filters.published;

    return where;
  }
}