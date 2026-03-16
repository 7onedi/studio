import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { SubcategoryQueryBuilder } from "../builders/subcategory.builder";

const crud = CrudConcern(prisma.subcategory);
const search = SearchConcern(prisma.subcategory, SubcategoryQueryBuilder);

export const subcategoryRepository = {
  ...crud,
  ...search,

  findAll() {
    return prisma.subcategory.findMany({
      include: { category: true },
    });
  },

  findBySlug(slug: string) {
    return prisma.subcategory.findFirst({
      where: { slug },
      include: { category: true },
    });
  },

  async existsBySlug(slug: string) {
    const subcategory = await prisma.subcategory.findFirst({
      where: { slug },
      select: { id: true },
    });
    return !!subcategory;
  },
};