import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { LocationQueryBuilder } from "@/api/builders/location.query.builder";

const crud = CrudConcern(prisma.location);
const search = SearchConcern(prisma.location, LocationQueryBuilder);

export const locationRepository = {
  ...crud,
  ...search,
};