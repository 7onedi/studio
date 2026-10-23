// tests/import-blogger.ts
// Run inside the app container:
//   npx tsx tests/import-blogger.ts                       (dry run, writes nothing)
//   npx tsx tests/import-blogger.ts --apply               (writes to DB)
//   npx tsx tests/import-blogger.ts --apply --allow-no-cover
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { normalizeTitleForSort } from "@/api/utils/normalize-for-sort";

const APPLY = process.argv.includes("--apply");
const ALLOW_NO_COVER = process.argv.includes("--allow-no-cover");
const PARENT_COVER = process.argv.includes("--parent-cover");
const FILE = process.env.ARTICLES_JSON ?? path.join(process.cwd(), "articles.json");
const AUTHOR_ID = 1;
const CATEGORY_SLUG = "youthinsight";
const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

// Сезон фестивалю: 1 липня – 30 червня. Підкатегорія називається "Youthinsight <сезон>".
const SEASON_CITY: Record<string, string> = {
  "2014-15": "VINNYTSIA",
  "2015-16": "VINNYTSIA",
  "2016-17": "VINNYTSIA",
  "2017-18": "VINNYTSIA",
  "2018-19": "VINNYTSIA",
  "2019-20": "VORONOVYTSIA",
  "2020-21": "VORONOVYTSIA",
  "2021-22": "VINNYTSIA",
};
const SEASONS = Object.keys(SEASON_CITY);
const FIRST_YEAR = 2014;
const LAST_YEAR = 2021;

const ext = (u: string) => (u.split(".").pop() ?? "").toLowerCase();
const diskPath = (u: string) => path.join(process.cwd(), "public", u);
const normName = (s: string) =>
  s.replace(/[\u2010-\u2015\u2212]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();

function seasonOf(iso?: string | null): { season: string | null; clamped: boolean } {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(+d)) return { season: null, clamped: false };
  const start = d.getUTCMonth() >= 6 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;
  const y = Math.min(Math.max(start, FIRST_YEAR), LAST_YEAR);
  return { season: `${y}-${String(y + 1).slice(2)}`, clamped: y !== start };
}

function imageUrls(body: any): string[] {
  const out: string[] = [];
  for (const b of body?.blocks ?? []) {
    if (b.type === "image" && b.data?.file?.url) out.push(b.data.file.url);
    else if (b.type === "customImage" && b.data?.url) out.push(b.data.url);
    else if (b.type === "gallery") {
      for (const f of b.data?.files ?? []) if (f?.url) out.push(f.url);
    }
  }
  return out;
}

function uniqueSlug(base: string, used: Set<string>, max = 180): string {
  const root = (base || "item").slice(0, max);
  let s = root;
  let n = 2;
  while (used.has(s)) s = `${root.slice(0, max - 6)}-${n++}`;
  used.add(s);
  return s;
}

const asDate = (v?: string | null) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(+d) ? d : null;
};

type Plan = {
  a: any;
  slug: string;
  title: string;
  tagKeys: string[];
  season: string | null;
  cover: string | null;
  fallbackImageId: number | null;
};

async function main() {
  const arts: any[] = JSON.parse(fs.readFileSync(FILE, "utf8"));

  const category = await prisma.category.findUnique({ where: { slug: CATEGORY_SLUG } });
  if (!category) throw new Error(`Category "${CATEGORY_SLUG}" not found`);
  const author = await prisma.user.findUnique({ where: { id: AUTHOR_ID } });
  if (!author) throw new Error(`User ${AUTHOR_ID} not found`);

  const existingSlugs = new Set((await prisma.article.findMany({ select: { slug: true } })).map((a) => a.slug));
  const usedSlugs = new Set(existingSlugs);

  // Підкатегорії сезонів шукаємо за назвою
  const subRows = await prisma.subcategory.findMany({
    where: { categoryId: category.id },
    select: { id: true, name: true },
  });
  const subByName = new Map<string, number>(subRows.map((s) => [normName(s.name), s.id] as [string, number]));
  const seasonSub = new Map<string, number>();
  const missingSeasons: string[] = [];
  for (const season of SEASONS) {
    const id = subByName.get(normName(`Youthinsight ${season}`));
    if (id) seasonSub.set(season, id);
    else missingSeasons.push(season);
  }

  // Картки фестивалів (дочірні проєкти) для міста і запасної обкладинки
  const projects = await prisma.studioProject.findMany({
    where: { subcategoryId: { in: [...seasonSub.values()] } },
    select: { id: true, subcategoryId: true, imageId: true, body: true },
  });
  const projBySub = new Map(projects.map((p) => [p.subcategoryId as number, p]));
  const parent = PARENT_COVER
    ? await prisma.studioProject.findFirst({
        where: { categoryId: category.id, parentId: null },
        select: { imageId: true },
      })
    : null;
  const seasonsWithoutProject = [...seasonSub.entries()]
    .filter(([, subId]) => !projBySub.has(subId))
    .map(([season]) => season);

  const tagRows = await prisma.tag.findMany({ select: { id: true, name: true, slug: true } });
  const tagIds = new Map<string, number>(tagRows.map((t) => [t.name.toLowerCase(), t.id] as [string, number]));
  const usedTagSlugs = new Set(tagRows.map((t) => t.slug));

  const mediaRows = await prisma.media.findMany({ select: { id: true, url: true } });
  const mediaIds = new Map<string, number>(mediaRows.map((m) => [m.url, m.id] as [string, number]));

  const plan: Plan[] = [];
  const newTags = new Map<string, { name: string; slug: string }>();
  const newMedia = new Set<string>();
  const missing = new Set<string>();
  const badExt = new Set<string>();
  const noCover: string[] = [];
  const perSeason = new Map<string, number>();
  let skipped = 0;
  let fixedTitles = 0;
  let clamped = 0;
  let noSeason = 0;
  let ownCover = 0;
  let fallbackCover = 0;
  let parentCover = 0;
  let drafts = 0;

  for (const a of arts) {
    if (existingSlugs.has(a.slug)) {
      skipped++;
      continue;
    }
    const slug = uniqueSlug(a.slug, usedSlugs);

    let title = String(a.title ?? "").trim();
    if (title.length < 3) {
      title = `Untitled ${String(a.date ?? "").slice(0, 10)}`;
      fixedTitles++;
    }
    if (title.length > 191) {
      title = title.slice(0, 191).trim();
      fixedTitles++;
    }

    const { season, clamped: wasClamped } = seasonOf(a.date);
    if (!season) noSeason++;
    if (wasClamped) clamped++;
    if (season) perSeason.set(season, (perSeason.get(season) ?? 0) + 1);
    if (!a.published) drafts++;

    const tagKeys: string[] = [];
    for (const t of a.tags ?? []) {
      const name = String(t.name ?? "").trim().slice(0, 191);
      if (!name) continue;
      const key = name.toLowerCase();
      tagKeys.push(key);
      if (!tagIds.has(key) && !newTags.has(key)) {
        newTags.set(key, { name, slug: uniqueSlug(String(t.slug ?? ""), usedTagSlugs) });
      }
    }

    for (const u of imageUrls(a.body)) {
      if (!MIME[ext(u)] || u.length > 191) badExt.add(u);
      if (!fs.existsSync(diskPath(u))) missing.add(u);
    }

    // Обкладинка: перша картинка статті, інакше картинка картки фестивалю цього сезону
    let cover: string | null = a.cover ?? null;
    if (cover && (!MIME[ext(cover)] || cover.length > 191 || !fs.existsSync(diskPath(cover)))) cover = null;
    let fallbackImageId: number | null = null;
    if (cover) {
      ownCover++;
      if (!mediaIds.has(cover)) newMedia.add(cover);
    } else {
      const proj = season ? projBySub.get(seasonSub.get(season) ?? -1) : undefined;
      if (proj?.imageId) {
        fallbackImageId = proj.imageId;
        fallbackCover++;
      } else if (parent?.imageId) {
        fallbackImageId = parent.imageId;
        parentCover++;
      } else {
        noCover.push(`${slug} (${a.lang})`);
      }
    }

    plan.push({ a, slug, title, tagKeys: [...new Set(tagKeys)], season, cover, fallbackImageId });
  }

  const cityToSet = [...seasonSub.entries()].filter(([season, subId]) => {
    const proj = projBySub.get(subId);
    const body = proj?.body as any;
    return proj && body?.city !== SEASON_CITY[season];
  });

  console.log(`articles in file: ${arts.length} | to create: ${plan.length} (drafts: ${drafts}) | skipped (slug exists): ${skipped}`);
  console.log("per season:", SEASONS.map((s) => `${s} ${SEASON_CITY[s]}: ${perSeason.get(s) ?? 0}`).join(" | "));
  console.log(`no date: ${noSeason} | dates outside seasons moved to nearest: ${clamped} | titles adjusted: ${fixedTitles}`);
  console.log(`season subcategories missing: ${missingSeasons.length} [${missingSeasons.join(", ")}]`);
  console.log(`season projects (cards) missing: ${seasonsWithoutProject.length} [${seasonsWithoutProject.join(", ")}] | city to set: ${cityToSet.length}`);
  console.log(`tags to create: ${newTags.size} | media records to create (covers): ${newMedia.size}`);
  console.log(`covers: own ${ownCover} | from festival card ${fallbackCover} | from Youthinsight page ${parentCover} | none ${noCover.length}`);
  console.log(`image files missing on disk: ${missing.size} | unsupported extension or too long: ${badExt.size}`);
  for (const u of [...missing].slice(0, 5)) console.log("  missing:", u);
  for (const u of [...badExt].slice(0, 5)) console.log("  bad ext:", u);
  for (const s of noCover.slice(0, 10)) console.log("  no cover:", s);

  if (!APPLY) {
    console.log("DRY RUN: nothing written. Re-run with --apply to import.");
    return;
  }
  if (missingSeasons.length) throw new Error("Create the missing season subcategories first");
  if (noCover.length && !ALLOW_NO_COVER) {
    throw new Error(`${noCover.length} articles have no cover; add a festival card image or pass --allow-no-cover`);
  }

  for (const [season, subId] of cityToSet) {
    const proj = projBySub.get(subId)!;
    const body = proj.body && typeof proj.body === "object" && !Array.isArray(proj.body) ? (proj.body as Record<string, unknown>) : {};
    await prisma.studioProject.update({
      where: { id: proj.id },
      data: { body: { ...body, city: SEASON_CITY[season] } },
    });
  }
  for (const [key, t] of newTags) {
    const row = await prisma.tag.create({ data: t });
    tagIds.set(key, row.id);
  }
  for (const url of newMedia) {
    const m = await prisma.media.create({
      data: {
        url,
        filename: path.basename(url),
        mimeType: MIME[ext(url)],
        size: fs.statSync(diskPath(url)).size,
        uploaderId: AUTHOR_ID,
      },
    });
    mediaIds.set(url, m.id);
  }

  let done = 0;
  for (const p of plan) {
    const a = p.a;
    const imageId = p.cover ? mediaIds.get(p.cover)! : p.fallbackImageId;
    const publishedAt = a.published ? asDate(a.publishedAt) ?? new Date() : null;
    await prisma.article.create({
      data: {
        slug: p.slug,
        title: p.title,
        titleSortKey: normalizeTitleForSort(p.title),
        lang: a.lang,
        body: a.body,
        authorName: String(a.authorName).slice(0, 64),
        author: { connect: { id: AUTHOR_ID } },
        category: { connect: { id: category.id } },
        image: imageId ? { connect: { id: imageId } } : undefined,
        subcategories: p.season && seasonSub.has(p.season) ? { connect: [{ id: seasonSub.get(p.season)! }] } : undefined,
        tags: { connect: p.tagKeys.map((k) => ({ id: tagIds.get(k)! })) },
        published: !!a.published,
        publishedAt,
        createdAt: asDate(a.createdAt) ?? undefined,
      },
    });
    if (++done % 100 === 0) console.log(`created ${done}/${plan.length}`);
  }
  console.log(`done: ${done} articles created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
