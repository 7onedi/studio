import { prisma } from "@/lib/prisma";
import { SocialPlatform } from "generated/prisma/enums";

export class SocialLinkRepository {
  async findOrCreate(platform: SocialPlatform) {
    let link = await prisma.socialLink.findUnique({ where: { platform } });
    if (!link) {
      link = await prisma.socialLink.create({ data: { platform } });
    }
    return link;
  }

  async findAll() {
    return prisma.socialLink.findMany();
  }

  async findByPlatform(platform: SocialPlatform) {
    return prisma.socialLink.findUnique({ where: { platform } });
  }
}

export const socialLinkRepository = new SocialLinkRepository();