// tests/import-blogger.ts
// Run inside the app container:
//   npx tsx tests/import-blogger.ts            (dry run, writes nothing)
//   npx tsx tests/import-blogger.ts --apply    (writes to DB)
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { normalizeTitleForSort } from "@/api/utils/normalize-for-sort";

const APPLY = process.argv.includes("--apply");
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

const ext = (u: string) => (u.split(".").pop() ?? "").toLowerCase();
const diskPath = (u: string) => path.join(process.cwd(), "public", u);

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

type Plan = { a: any; slug: string; title: string; tagKeys: string[]; cover: string | null };

async function main() {
  const arts: any[] = JSON.parse(fs.readFileSync(FILE, "utf8"));

  const category = await prisma.category.findUnique({ where: { slug: CATEGORY_SLUG } });
  if (!category) throw new Error(`Category "${CATEGORY_SLUG}" not found`);
  const author = await prisma.user.findUnique({ where: { id: AUTHOR_ID } });
  if (!author) throw new Error(`User ${AUTHOR_ID} not found`);

  const existingSlugs = new Set((await prisma.article.findMany({ select: { slug: true } })).map((a) => a.slug));
  const usedSlugs = new Set(existingSlugs);

  const subRows = await prisma.subcategory.findMany({
    where: { categoryId: category.id },
    select: { id: true, slug: true },
  });
  const subIds = new Map<string, number>(subRows.map((s) => [s.slug, s.id] as [string, number]));

  const tagRows = await prisma.tag.findMany({ select: { id: true, name: true, slug: true } });
  const tagIds = new Map<string, number>(tagRows.map((t) => [t.name.toLowerCase(), t.id] as [string, number]));
  const usedTagSlugs = new Set(tagRows.map((t) => t.slug));

  const mediaRows = await prisma.media.findMany({ select: { id: true, url: true } });
  const mediaIds = new Map<string, number>(mediaRows.map((m) => [m.url, m.id] as [string, number]));

  const plan: Plan[] = [];
  const newSubs = new Map<string, string>();
  const newTags = new Map<string, { name: string; slug: string }>();
  const newMedia = new Set<string>();
  const missing = new Set<string>();
  const badExt = new Set<string>();
  let skipped = 0;
  let fixedTitles = 0;
  let coversDropped = 0;

  for (const a of arts) {
    if (existingSlugs.has(a.slug)) {
      skipped++;
      console.log("  skip:", a.slug);
      continue;
    }
    const slug = uniqueSlug(a.slug, usedSlugs);

    let title = String(a.title ?? "").trim();
    if (title.length < 3) {
      title = `Untitled ${String(a.publishedAt).slice(0, 10)}`;
      fixedTitles++;
    }
    if (title.length > 191) {
      title = title.slice(0, 191).trim();
      fixedTitles++;
    }

    for (const s of a.subcategories ?? []) {
      if (!subIds.has(s.slug) && !newSubs.has(s.slug)) newSubs.set(s.slug, s.name);
    }

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

    let cover: string | null = a.cover ?? null;
    if (cover && (!MIME[ext(cover)] || !fs.existsSync(diskPath(cover)))) {
      cover = null;
      coversDropped++;
    }
    if (cover && !mediaIds.has(cover)) newMedia.add(cover);

    plan.push({ a, slug, title, tagKeys: [...new Set(tagKeys)], cover });
  }

  console.log(`articles in file: ${arts.length} | to create: ${plan.length} | skipped (slug exists): ${skipped}`);
  console.log(`titles adjusted: ${fixedTitles} | subcategories to create: ${newSubs.size} [${[...newSubs.keys()].join(", ")}]`);
  console.log(`tags to create: ${newTags.size} | media records to create (covers): ${newMedia.size} | covers dropped: ${coversDropped}`);
  console.log(`image files missing on disk: ${missing.size} | unsupported extension: ${badExt.size}`);
  for (const u of [...missing].slice(0, 5)) console.log("  missing:", u);
  for (const u of [...badExt].slice(0, 5)) console.log("  bad ext:", u);

  if (!APPLY) {
    console.log("DRY RUN: nothing written. Re-run with --apply to import.");
    return;
  }

  for (const [slug, name] of newSubs) {
    const s = await prisma.subcategory.create({ data: { name, slug, categoryId: category.id } });
    subIds.set(slug, s.id);
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
    const published = new Date(a.publishedAt);
    const created = new Date(a.createdAt);
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
        image: p.cover ? { connect: { id: mediaIds.get(p.cover)! } } : undefined,
        subcategories: { connect: (a.subcategories ?? []).map((s: any) => ({ id: subIds.get(s.slug)! })) },
        tags: { connect: p.tagKeys.map((k) => ({ id: tagIds.get(k)! })) },
        published: true,
        publishedAt: isNaN(+published) ? new Date() : published,
        createdAt: isNaN(+created) ? undefined : created,
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