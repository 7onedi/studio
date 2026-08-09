import { prisma } from "@/lib/prisma";

export async function getProjectMarkers(parentId: number) {
  return prisma.studioProject.findMany({
    where: {
      parentId,
      markerType: { not: null },
      published: true,
    },
    include: {
      image: true,
      location: true,
    },
  });
}