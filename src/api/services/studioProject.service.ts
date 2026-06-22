// studioProject.service.ts
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

  class StudioProjectService extends BaseService {
  constructor() {
    super(studioProjectRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreateStudioProject);

    const data = createStudioProjectSchema.parse(body);

    const locationInput = data.locationData
      ? { create: data.locationData }
      : data.locationId
        ? { connect: { id: data.locationId } }
        : undefined;

    const project = await this.repository.create({
      title: data.title,
      body: data.body,
      body_en: data.body_en,
      body_pl: data.body_pl,
      body_lt: data.body_lt,
      body_ro: data.body_ro,
      description: data.description,
      category: { connect: { id: data.categoryId } },
      subcategory: data.subcategoryId
        ? { connect: { id: data.subcategoryId } }
        : undefined,
      image: data.imageId ? { connect: { id: data.imageId } } : undefined,
      logo: data.logoId ? { connect: { id: data.logoId } } : undefined,
      location: locationInput,
      parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
      author: user.id ? { connect: { id: user.id } } : undefined,
    });

    if (data.socialLinks?.length) {
      await studioProjectRepository.syncSocialLinks(project.id, data.socialLinks);
    }

    return studioProjectRepository.findById(project.id);
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdateStudioProject);

    const data = updateStudioProjectSchema.partial().parse(body);

    let locationInput: any = undefined;

    if (data.deleteLocation) {
      await studioProjectRepository.detachAndDeleteLocation(id);
    } else if (data.locationData) {
      const existing = await this.repository.findById(id);

      locationInput = existing?.locationId
        ? { update: { where: { id: existing.locationId }, data: data.locationData } }
        : { create: data.locationData };
    } else if (data.locationId) {
      locationInput = { connect: { id: data.locationId } };
    }

    const { socialLinks, locationData, deleteLocation, locationId, ...rest } = data;

    await this.repository.update(id, {
      ...rest,
      category: rest.categoryId ? { connect: { id: rest.categoryId } } : undefined,
      subcategory: rest.subcategoryId ? { connect: { id: rest.subcategoryId } } : undefined,
      image: rest.imageId ? { connect: { id: rest.imageId } } : undefined,
      logo: rest.logoId ? { connect: { id: rest.logoId } } : undefined,
      parent: rest.parentId ? { connect: { id: rest.parentId } } : undefined,
      location: locationInput,
      categoryId: undefined,
      subcategoryId: undefined,
      imageId: undefined,
      parentId: undefined,
      logoId: undefined,
    });

    if (socialLinks !== undefined) {
      await studioProjectRepository.syncSocialLinks(id, socialLinks);
    }

    return studioProjectRepository.findById(id);
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