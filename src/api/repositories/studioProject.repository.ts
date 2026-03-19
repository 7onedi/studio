// studioProject.repository.ts
import { prisma } from "@/lib/prisma";
import { CrudConcern } from "@/api/concerns/crud.concern";
import { SearchConcern } from "@/api/concerns/search.concern";
import { StudioProjectQueryBuilder } from "@/api/builders/studioProject.query.builder";
import { StudioProjectInclude } from "@/api/api-builder/studioProject.api-builder";

const crud = CrudConcern(prisma.studioProject);
const search = SearchConcern(prisma.studioProject, StudioProjectQueryBuilder);

export const studioProjectRepository = {
  ...crud,
  ...search,

  publish(id: number) {
    return prisma.studioProject.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
      include: StudioProjectInclude,
    });
  },

  create(data: any) {
    return prisma.studioProject.create({
      data,
      include: StudioProjectInclude,
    });
  },

  update(id: number, data: any) {
    return prisma.studioProject.update({
      where: { id },
      data,
      include: StudioProjectInclude,
    });
  },

  findById(id: number) {
    return prisma.studioProject.findUnique({
      where: { id },
      include: StudioProjectInclude,
    });
  },

  async syncSocialLinks(
    projectId: number,
    links: { platform: string; url: string }[]
  ) {
    const socialLinkIds = await Promise.all(
      links.map(async (link) => {
        const social = await prisma.socialLink.upsert({
          where: { platform: link.platform as any },
          create: { platform: link.platform as any },
          update: {},
        });
        return { socialId: social.id, url: link.url };
      })
    );

    await prisma.projectSocialLink.deleteMany({ where: { projectId } });

    if (socialLinkIds.length > 0) {
      await prisma.projectSocialLink.createMany({
        data: socialLinkIds.map(({ socialId, url }) => ({
          projectId,
          socialId,
          url,
        })),
      });
    }
  },

  async detachAndDeleteLocation(projectId: number) {
    const project = await prisma.studioProject.findUnique({
      where: { id: projectId },
      select: { locationId: true },
    });

    if (!project?.locationId) return;

    await prisma.studioProject.update({
      where: { id: projectId },
      data: { location: { disconnect: true } },
    });

    await prisma.location.delete({ where: { id: project.locationId } });
  },
};