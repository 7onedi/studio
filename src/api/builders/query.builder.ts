type Filters = Record<string, any>;
type Options = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export class QueryBuilder {
  protected filters: Filters = {};
  protected options: Required<Options> = { page: 1, limit: 10, sortBy: "createdAt", order: "desc" };

  setFilters(filters: Filters) {
    this.filters = filters;
    return this;
  }

  setOptions(options: Options) {
    this.options = { ...this.options, ...options };
    return this;
  }

  build() {
    const { page, limit, sortBy, order } = this.options;

    return {
      where: this.buildWhere(),
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    };
  }

  protected buildWhere(): Filters {
    return this.filters;
  }
}