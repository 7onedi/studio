import { studioProjectService } from "@/api/services/studioProject.service";
import { StudioProjectInclude } from "../api-builder/studioProject.api-builder";

export const studioProjectController = {
  create: (body: any, user: any) => studioProjectService.create(user, body),
  update: (id: number, body: any, user: any) => studioProjectService.update(user, id, body),
  delete: (id: number, user: any) => studioProjectService.delete(user, id),
  publish: (body: any, user: any) => studioProjectService.publish(user, body),
  findById: (id: number) => studioProjectService.findById(id),
  search: (filters: Record<string, any>, options?: any) =>
    studioProjectService.search(filters, options, StudioProjectInclude),
};