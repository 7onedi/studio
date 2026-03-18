import { QueryBuilder } from "./query.builder";

export class PartnerQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const where: any = {};
    const filters = this.filters;

    if (filters.name)   where.name   = { contains: filters.name };
    if (filters.email)  where.email  = { contains: filters.email };
    if (filters.role)   where.role   = filters.role;
    if (filters.status) where.status = filters.status;

    if (typeof filters.published === "boolean") where.published = filters.published;

    return where;
  }
}