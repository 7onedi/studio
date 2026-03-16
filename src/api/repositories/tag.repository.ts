import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { TagQueryBuilder } from "../builders/tag.builder";

const crud = CrudConcern(prisma.tag);
const search = SearchConcern(prisma.tag, TagQueryBuilder);

export const tagRepository = {
  ...crud,
  ...search,

  findAll() {
    return prisma.tag.findMany();
  },

  findBySlug(slug: string) {
    return prisma.tag.findUnique({
      where: { slug },
    });
  },

  async existsBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!tag;
  },
};