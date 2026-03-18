import { partnerService } from "@/api/services/partner.service";
import { PartnerInclude } from "@/api/api-builder/partner.api-builder";

export const partnerController = {
  create:       (body: any, user: any)              => partnerService.create(user, body),
  update:       (id: number, body: any, user: any)  => partnerService.update(user, id, body),
  updateStatus: (body: any, user: any)              => partnerService.updateStatus(user, body),
  publish:      (body: any, user: any)              => partnerService.publish(user, body),
  delete:       (id: number, user: any)             => partnerService.delete(user, id),
  findById:     (id: number)                        => partnerService.findById(id),
  search:       (filters: Record<string, any>, options?: any) =>
    partnerService.search(filters, options, PartnerInclude),
};