import fs from 'fs';
import path from 'path';
import { articleRepository } from "@/api/repositories/article.repository";
import { createArticleSchema, updateArticleSchema, publishArticleSchema } from "@/api/schemas/article.schema";
import { canCreateArticle, canPublishArticle, canUpdateArticle, canDeleteArticle } from "@/api/policies/article.policy";
import { tagRepository } from "@/api/repositories/tag.repository";
import { mediaRepository } from "@/api/repositories/media.repository";
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

		const { categoryId, subcategoryIds, tags, currentImageId, authorAvatarId, ...rest } = data;

		return this.repository.create({
			slug,
			...rest,
			author: { connect: { id: user.id } },
			category: { connect: { id: categoryId } },
			image: currentImageId ? { connect: { id: currentImageId } } : undefined,
			authorAvatar: authorAvatarId ? { connect: { id: authorAvatarId } } : undefined,
			subcategories: subcategoryIds ? { connect: subcategoryIds.map((id) => ({ id })) } : undefined,
			tags: tags ? { /* без змін */ } : undefined,
		});
	}

	async update(user: any, id: number, body: any) {
		this.assertPolicy(user, canUpdateArticle);

		const data = updateArticleSchema.partial().parse(body);
		const { categoryId, subcategoryIds, tags, currentImageId, authorAvatarId, ...rest } = data;

		return this.repository.update(id, {
			...rest,

			image: currentImageId !== undefined
			? currentImageId === null
				? { disconnect: true }
				: { connect: { id: currentImageId } }
			: undefined,

			authorAvatar: authorAvatarId !== undefined
			? authorAvatarId === null
				? { disconnect: true }
				: { connect: { id: authorAvatarId } }
			: undefined,

			category: categoryId
			? { connect: { id: categoryId } }
			: undefined,

			subcategories: subcategoryIds
			? { set: subcategoryIds.map((id: number) => ({ id })) }
			: undefined,

			tags: tags
			? {
				set: [],
				connectOrCreate: await Promise.all(
					tags.map(async (tag: any) => {
					const tagSlug = await generateUniqueSlug(
						(slug) => tagRepository.existsBySlug(slug),
						tag.name
					);
					return {
						where: { name: tag.name },
						create: { name: tag.name, slug: tagSlug },
					};
					})
				),
				}
			: undefined,
		});
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

	async findBySlug(slug: string) {
		return this.repository.findBySlug(slug);
	}
}

export const articleService = new ArticleService();