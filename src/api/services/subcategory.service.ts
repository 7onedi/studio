import { subcategoryRepository } from "@/api/repositories/subcategory.repository";
import { createSubcategorySchema, updateSubcategorySchema } from "@/api/schemas/subcategory.schema";
import { canCreateSubcategory, canUpdateSubcategory, canDeleteSubcategory } from "@/api/policies/subcategory.policy";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";
import { BaseService } from "./base.service";

class SubcategoryService extends BaseService {
  constructor() {
    super(subcategoryRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreateSubcategory);

    const data = createSubcategorySchema.parse(body);

    const slug = await generateUniqueSlug(
      (slug) => subcategoryRepository.existsBySlug(slug),
      data.name
    );
    const { categoryId, ...rest } = data;
    return this.repository.create({
      ...rest,
      slug,
      category: { connect: { id: categoryId } },
    });
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdateSubcategory);

    const data = updateSubcategorySchema.partial().parse(body);

    return this.repository.update(id, data);
  }

  async delete(user: any, id: number) {
    this.assertPolicy(user, canDeleteSubcategory);

    return this.repository.delete(id);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  list() {
    return this.repository.findMany();
  }
}

export const subcategoryService = new SubcategoryService();