import { QueryBuilder } from "./query.builder";

export class TagQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const filters = this.filters;
    const where: any = {};
    if (filters.name) where.name = { contains: filters.name };
    return where;
  }
}