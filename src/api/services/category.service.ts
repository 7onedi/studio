import { categoryRepository } from "@/api/repositories/category.repository";
import { createCategorySchema, updateCategorySchema } from "@/api/schemas/category.schema";
import { canCreateCategory, canUpdateCategory, canDeleteCategory } from "@/api/policies/category.policy";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";
import { BaseService } from "./base.service";

class CategoryService extends BaseService {

  constructor() {
    super(categoryRepository);
  }

  async create(user: any, body: unknown) {
		this.assertPolicy(user, canCreateCategory);
    const data = createCategorySchema.parse(body);

    const slug = await generateUniqueSlug(
      (slug) => categoryRepository.existsBySlug(slug),
      data.name
    );

    return this.repository.create({
      ...data,
      slug
    });
  }

	async update(user: any, id: number, body: unknown) {
		this.assertPolicy(user, canUpdateCategory);
    const data = updateCategorySchema.partial().parse(body);

    return this.repository.update(id, data);
  }

	async delete(user: any, id: number) {
		this.assertPolicy(user, canDeleteCategory);
		return this.repository.delete(id);
	}

	findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  list() {
    return this.repository.findMany();
  }
}

export const categoryService = new CategoryService();