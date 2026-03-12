import { studioProjectRepository } from "@/api/repositories/studioProject.repository";
import { BaseService } from "./base.service";
import {
  createStudioProjectSchema,
  updateStudioProjectSchema,
  publishStudioProjectSchema,
} from "@/api/schemas/studioProject.schema";
import {
  canCreateStudioProject,
  canUpdateStudioProject,
  canPublishStudioProject,
  canDeleteStudioProject,
} from "@/api/policies/studioProject.policy";
import { generateUniqueSlug } from "@/api/utils/generate-unique-slug";

class StudioProjectService extends BaseService {
  constructor() {
    super(studioProjectRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreateStudioProject);

    const data = createStudioProjectSchema.parse(body);

    return this.repository.create({
      title: data.title,
      body: data.body,
      description: data.description,
      category: { connect: { id: data.categoryId } },
      subcategory: data.subcategoryId ? { connect: { id: data.subcategoryId } } : undefined,
      image: data.imageId ? { connect: { id: data.imageId } } : undefined,
      location: data.locationId ? { connect: { id: data.locationId } } : undefined,
      parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
      author: user.id ? { connect: { id: user.id } } : undefined,
    });
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdateStudioProject);

    const data = updateStudioProjectSchema.partial().parse(body);
    return this.repository.update(id, data);
  }

  async publish(user: any, body: unknown) {
    this.assertPolicy(user, canPublishStudioProject);

    const data = publishStudioProjectSchema.parse(body);
    return this.repository.publish(data.id);
  }

  async delete(user: any, id: number) {
    this.assertPolicy(user, canDeleteStudioProject);
    return this.repository.delete(id);
  }
}

export const studioProjectService = new StudioProjectService();