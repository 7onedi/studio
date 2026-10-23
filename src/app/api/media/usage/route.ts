import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Kind = 'article' | 'childProject' | 'project' | 'partner' | 'avatar';
type Usage = { kind: Kind; id: number; title: string };

const projKind = (parentId: number | null): Kind => (parentId ? 'childProject' : 'project');

const pTitle = (p: { id: number; title: string; title_en?: string | null }) =>
  p.title_en || p.title || `Project #${p.id}`;

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get('ids') ?? '')
    .split(',').map(Number).filter(Boolean);
  if (!ids.length) return NextResponse.json({});

  const medias = await prisma.media.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      url: true,
      articles: { select: { id: true, title: true } },
      articleAuthorAvatars: { select: { id: true, title: true } },
      projects: { select: { id: true, title: true, title_en: true, parentId: true } },
      projectLogos: { select: { id: true, title: true, title_en: true, parentId: true } },
      partners: { select: { id: true, name: true } },
      userAvatars: { select: { id: true, name: true, email: true } },
    },
  });

  const result: Record<number, Usage[]> = {};
  await Promise.all(medias.map(async (m) => {
    const like = '%' + m.url.replace(/[\\%_]/g, '\\$&') + '%';

    const [inArticles, inProjects] = await Promise.all([
      prisma.$queryRaw<{ id: number; title: string }[]>`
        SELECT id, title FROM Article WHERE CAST(body AS CHAR) LIKE ${like}`,
      prisma.$queryRaw<{ id: number; title: string; title_en: string | null; parentId: number | null }[]>`
        SELECT id, title, title_en, parentId FROM StudioProject
        WHERE CAST(body AS CHAR) LIKE ${like} OR CAST(body_en AS CHAR) LIKE ${like}
           OR CAST(body_pl AS CHAR) LIKE ${like} OR CAST(body_lt AS CHAR) LIKE ${like}
           OR CAST(body_ro AS CHAR) LIKE ${like}`,
    ]);

    const map = new Map<string, Usage>();
    const add = (u: Usage) => map.set(`${u.kind}:${u.id}`, u);

    [...m.articles, ...inArticles].forEach((a) => add({ kind: 'article', id: a.id, title: a.title }));
    [...m.projects, ...m.projectLogos, ...inProjects].forEach((p) =>
      add({ kind: projKind(p.parentId), id: p.id, title: pTitle(p) }));
    m.partners.forEach((p) => add({ kind: 'partner', id: p.id, title: p.name }));
    m.userAvatars.forEach((u) => add({ kind: 'avatar', id: u.id, title: u.name ?? u.email }));
    m.articleAuthorAvatars.forEach((a) => add({ kind: 'avatar', id: a.id, title: a.title }));

    result[m.id] = [...map.values()];
  }));

  return NextResponse.json(result);
}