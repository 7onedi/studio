import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { CategoryQueryBuilder } from "../builders/category.builder";

const crud = CrudConcern(prisma.category);
const search = SearchConcern(prisma.category, CategoryQueryBuilder);

export const categoryRepository = {
  ...crud,
  ...search,

  findAll() {
    return prisma.category.findMany({
      include: { subcategories: true },
    });
  },

  findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  async existsBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    return !!category;
  },
};