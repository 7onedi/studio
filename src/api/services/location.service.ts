import { BaseService } from "./base.service";
import { locationRepository } from "@/api/repositories/location.repository";
import { createLocationSchema, updateLocationSchema } from "@/api/schemas/location.schema";
import { canCreateLocation, canUpdateLocation, canDeleteLocation } from "@/api/policies/location.policy";

class LocationService extends BaseService {
  constructor() {
    super(locationRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreateLocation);

    const data = createLocationSchema.parse(body);

    return this.repository.create({
      name: data.name,
      url: data.url,
      coordinates: data.coordinates,
      description: data.description,
      project: data.projectId ? { connect: { id: data.projectId } } : undefined,
      publishedAt: data.published ? new Date() : null,
    });
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdateLocation);

    const data = updateLocationSchema.partial().parse(body);
    return this.repository.update(id, data);
  }

  async publish(user: any, id: number) {
    this.assertPolicy(user, canUpdateLocation);
    return this.repository.publish(id);
  }

  async delete(user: any, id: number) {
    this.assertPolicy(user, canDeleteLocation);
    return this.repository.delete(id);
  }
}

export const locationService = new LocationService();