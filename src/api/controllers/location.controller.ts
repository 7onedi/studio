import { locationService } from "@/api/services/location.service";
import { LocationInclude } from "../api-builder/location.api-builder";

export const locationController = {
  create: (body: any, user: any) => locationService.create(user, body),
  update: (id: number, body: any, user: any) => locationService.update(user, id, body),
  delete: (id: number, user: any) => locationService.delete(user, id),
  publish: (id: number, user: any) => locationService.publish(user, id),
  findById: (id: number) => locationService.findById(id),
  search: (filters: Record<string, any>, options?: any) =>
    locationService.search(filters, options, LocationInclude),
};