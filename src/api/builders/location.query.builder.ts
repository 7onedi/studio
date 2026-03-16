import { QueryBuilder } from "./query.builder";

export class LocationQueryBuilder extends QueryBuilder {
  protected buildWhere() {
    const where: any = {};
    const filters = this.filters;

    if (filters.name) where.name = { contains: filters.name };
    if (filters.publishedAt) where.publishedAt = filters.publishedAt;
    if (filters.studioProjectId) where.projectId = Number(filters.studioProjectId);
    if (filters.studioProject?.published !== undefined) {
      where.project = { is: { published: filters.studioProject.published } };
    }

    return where;
  }
}