import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { StudioProjectQueryBuilder } from "@/api/builders/studioProject.query.builder";

const crud = CrudConcern(prisma.studioProject);
const search = SearchConcern(prisma.studioProject, StudioProjectQueryBuilder);

export const studioProjectRepository = {
  ...crud,
  ...search,

  publish(id: number) {
    return prisma.studioProject.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
    });
  }
};