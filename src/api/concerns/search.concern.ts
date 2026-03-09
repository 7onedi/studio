import { QueryBuilder } from "@/api/builders/query.builder";

type SearchOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export function SearchConcern(model: any, BuilderClass?: typeof QueryBuilder) {
  return {
    async search(filters: Record<string, any> = {}, options?: SearchOptions, include?: any) {
      let query: ReturnType<QueryBuilder['build']>;

      if (BuilderClass) {
        const builder = new BuilderClass()
          .setFilters(filters)
          .setOptions(options ?? {});
        query = builder.build();
      } else {
        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;
        const sortBy = options?.sortBy ?? "createdAt";
        const order = options?.order ?? "desc";

        query = {
          where: filters,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: order },
        };
      }

      const total = await model.count({ where: query.where });

      const data = await model.findMany({
        ...query,
        include,
      });

      return {
        data,
        total,
        page: options?.page ?? 1,
        limit: options?.limit ?? 10,
        pages: Math.ceil(total / (options?.limit ?? 10)),
      };
    },
  };
}