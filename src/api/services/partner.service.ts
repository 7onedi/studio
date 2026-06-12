import { BaseService } from "./base.service";
import {
  createPartnerSchema,
  updatePartnerSchema,
  updatePartnerStatusSchema,
  publishPartnerSchema,
} from "@/api/schemas/partner.schema";
import {
  canCreatePartner,
  canUpdatePartner,
  canUpdatePartnerStatus,
  canPublishPartner,
  canDeletePartner,
} from "@/api/policies/partner.policy";
import { partnerRepository } from "../repositories/partner.repository";
import { mediaService } from "./media.service";

class PartnerService extends BaseService {
  constructor() {
    super(partnerRepository);
  }

  async create(user: any, body: unknown) {
    this.assertPolicy(user, canCreatePartner);

    const data = createPartnerSchema.parse(body);

    return partnerRepository.create({
      name:        data.name,
      email:       data.email,
      role:        data.role,
      description: data.description,
      link:        data.link,
      image:       data.imageId ? { connect: { id: data.imageId } } : undefined,
    });
  }

  async update(user: any, id: number, body: unknown) {
    this.assertPolicy(user, canUpdatePartner);

    const data = updatePartnerSchema.parse(body);
    if (data.imageId) {
      const existing = await partnerRepository.findById(id);
      if (existing?.imageId && existing.imageId !== data.imageId) {
        try {
          await mediaService.delete(user, existing.imageId);
        } catch {}
      }
    }

    return partnerRepository.update(id, {
      name:        data.name,
      email:       data.email,
      role:        data.role,
      description: data.description,
      link:        data.link,
      image:       data.imageId ? { connect: { id: data.imageId } } : undefined,
    });
  }

  async updateStatus(user: any, body: unknown) {
    this.assertPolicy(user, canUpdatePartnerStatus);

    const data = updatePartnerStatusSchema.parse(body);
    return partnerRepository.updateStatus(data.id, data.status);
  }

  async publish(user: any, body: unknown) {
    this.assertPolicy(user, canPublishPartner);

    const data = publishPartnerSchema.parse(body);
    return partnerRepository.publish(data.id);
  }

  async unpublish(user: any, body: unknown) {
    this.assertPolicy(user, canPublishPartner);
    const data = publishPartnerSchema.parse(body);
    return partnerRepository.unpublish(data.id);
  }

async delete(user: any, id: number) {
  this.assertPolicy(user, canDeletePartner);

  const partner = await partnerRepository.findById(id);
  await partnerRepository.delete(id);
  if (partner?.imageId) {
    await mediaService.delete(user, partner.imageId);
  }

  return partner;
}

  async findById(id: number) {
    return partnerRepository.findById(id);
  }

  async search(filters: Record<string, any>, options?: any, include?: any) {
    return partnerRepository.search(filters, options, include);
  }
}

export const partnerService = new PartnerService();