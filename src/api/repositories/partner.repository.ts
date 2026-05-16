import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { PartnerInclude } from "@/api/api-builder/partner.api-builder";
import { PartnerQueryBuilder } from "@/api/builders/partner.query.builder";

const crud   = CrudConcern(prisma.partner);
const search = SearchConcern(prisma.partner, PartnerQueryBuilder);


export const partnerRepository = {
  ...crud,
  ...search,

  findById(id: number) {
    return prisma.partner.findUnique({
      where: { id },
      include: PartnerInclude,
    });
  },

  create(data: any) {
    return prisma.partner.create({
      data,
      include: PartnerInclude,
    });
  },

  update(id: number, data: any) {
    return prisma.partner.update({
      where: { id },
      data,
      include: PartnerInclude,
    });
  },

  updateStatus(id: number, status: "PENDING" | "APPROVED" | "REJECTED") {
    return prisma.partner.update({
      where: { id },
      data: { status },
      include: PartnerInclude,
    });
  },

  publish(id: number) {
    return prisma.partner.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
      include: PartnerInclude,
    });
  },

  unpublish(id: number) {
    return prisma.partner.update({
      where: { id },
      data: { published: false, publishedAt: null },
      include: PartnerInclude,
    });
  },
};