import { QueryBuilder } from "./query.builder";

export class SubcategoryQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const filters = this.filters;
    const where: any = {};
    if (filters.name) where.name = { contains: filters.name };
    if (filters.categoryId) where.categoryId = Number(filters.categoryId);
    return where;
  }
}