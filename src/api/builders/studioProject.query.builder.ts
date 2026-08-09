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

    if (filters.markerType && typeof filters.markerType === "object") {
      where.markerType = filters.markerType; // { not: null }
    } else if (filters.markerType === "null") {
      where.markerType = null;
    } else if (filters.markerType) {
      where.markerType = filters.markerType;
    }

    return where;
  }
}