import { QueryBuilder } from "./query.builder";

export class StudioProjectQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const where: any = {};
    const filters = this.filters;

    if (filters.title) where.title = { contains: filters.title };
    if (filters.parentId !== undefined) where.parentId = filters.parentId;
    if (filters.categoryId) where.categoryId = Number(filters.categoryId);
    if (filters.subcategoryId) where.subcategoryId = Number(filters.subcategoryId);
    if (typeof filters.published === "boolean") where.published = filters.published;

    return where;
  }
}