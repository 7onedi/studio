import { QueryBuilder } from "@/api/builders/query.builder";

export class UserQueryBuilder extends QueryBuilder {

  protected buildWhere() {
    const filters = this.filters;
    const where: any = {};
    if (filters.name) where.name = { contains: filters.name };
    if (filters.email) where.email = { contains: filters.email };
    if (filters.role) where.role = filters.role;
    return where;
  }
}
