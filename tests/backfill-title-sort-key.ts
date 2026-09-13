// scripts/backfill-title-sort-key.ts
import { prisma } from "@/lib/prisma";
import { normalizeTitleForSort } from "@/api/utils/normalize-for-sort";

async function main() {
  const articles = await prisma.article.findMany({ select: { id: true, title: true } });
  for (const a of articles) {
    await prisma.article.update({
      where: { id: a.id },
      data: { titleSortKey: normalizeTitleForSort(a.title) },
    });
  }
  console.log(`Updated ${articles.length} articles`);
}

main().finally(() => prisma.$disconnect());