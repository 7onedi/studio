import { articleRepository } from "@/api/repositories/article.repository";
import { createArticleSchema, updateArticleSchema, publishArticleSchema } from "@/api/schemas/article.schema";
import { canCreateArticle, canPublishArticle, canUpdateArticle, canDeleteArticle } from "@/api/policies/article.policy";
import { tagRepository } from "@/api/repositories/tag.repository";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";
import { BaseService } from "./base.service";

class ArticleService extends BaseService {
  constructor() {
    super(articleRepository);
  }

  async create(user: any, body: unknown) {

    this.assertPolicy(user, canCreateArticle);

    const data = createArticleSchema.parse(body);

    const slug = await generateUniqueSlug(
      (slug) => this.repository.existsBySlug(slug),
      data.title
    );
		const { categoryId, subcategoryIds, tags, ...rest } = data;
		return this.repository.create({
			slug,
			...rest,
			author: { connect: { id: user.id } },
			category: { connect: { id: categoryId } },
			subcategories: subcategoryIds
				? { connect: subcategoryIds.map((id) => ({ id })) }
				: undefined,
			tags: tags
				? {
						connectOrCreate: await Promise.all(
							tags.map(async (tag) => {
								const tagSlug = await generateUniqueSlug(
									(slug) => tagRepository.existsBySlug(slug),
									tag.name
								);

								return {
									where: { slug: tagSlug },
									create: { name: tag.name, slug: tagSlug },
								};
							})
						),
					}
				: undefined,
		});
  }

	async update(user: any, id: number, body: any) {
    this.assertPolicy(user, canUpdateArticle); 
    const data = updateArticleSchema.partial().parse(body);

    return this.repository.update(id, data);
  }

  async publish(user: any, body: unknown) {

    this.assertPolicy(user, canPublishArticle);

    const data = publishArticleSchema.parse(body);

    return this.repository.publish(data.id);
  }

	async delete(user: any, id: number) {
		this.assertPolicy(user, canDeleteArticle);
		return this.repository.delete(id);
	}
}

export const articleService = new ArticleService();