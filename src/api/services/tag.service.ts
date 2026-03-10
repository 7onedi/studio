// tag.service.ts
import { tagRepository } from "@/api/repositories/tag.repository";
import { createTagSchema, updateTagSchema } from "@/api/schemas/tag.schema";
import { canCreateTag, canDeleteTag, canUpdateTag } from "@/api/policies/tag.policy";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";
import { BaseService } from "./base.service";

export class TagService extends BaseService {
  constructor() {
    super(tagRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreateTag);
    const data = createTagSchema.parse(body);

    const slug = await generateUniqueSlug(
      (slug) => this.repository.existsBySlug(slug),
      data.name
    );

    return this.repository.create({ ...data, slug });
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdateTag);
    const data = updateTagSchema.parse(body);

    return this.repository.update(id, data);
  }

  async delete(user: any, id: number) {
    this.assertPolicy(user, canDeleteTag);
    return this.repository.delete(id);
  }

  list() {
    return this.repository.findMany();
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }
}

export const tagService = new TagService();