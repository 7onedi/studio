import { notFound } from "next/navigation";
import ArticleHero from "@/app/public/blocks/ArticleHero";
import { ArticleBody } from "@/app/public/blocks/ArticleBody";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import ArticleMfkList from "@blocks/ArticleMfkList";
import ClientBg from "@/app/public/providers/ClientBg";
import { getCategoryId } from '@lib/getCategoryId';
import BlogSlider from "@/app/public/blocks/BlogSlider";
import TranslatedText from "@components/TranslatedText";
import type { Metadata } from "next";
import ShareIcons from "@/app/public/components/ShareIcons";
import { buildMetadata, extractDescription, absoluteUrl, OG_LOCALE } from "@/lib/seo";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

async function fetchArticleBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}/api/articles/by-slug/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  
  console.log("gallery blocks:", JSON.stringify(
    data?.body?.blocks?.filter((b: any) => b.type === "gallery"),
    null, 2
  ));
  
  return data;
}

async function fetchAllArticles() {
  const res = await fetch(
    `${BASE_URL}/api/articles/search?limit=100&sortBy=publishedAt&order=desc&published=true`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  console.log("sample lang:", data?.data?.[0]?.lang);
  return Array.isArray(data?.data) ? data.data : [];
}

export const dynamic = "force-dynamic";

function toArticleProps(article: any) {
  const blocks = (article.body?.blocks ?? []).map((block: any) => {
    if (block.type === "image" && block.data?.file?.url) return block;
    if (block.type === "gallery" && Array.isArray(block.data?.files)) return block;
    return block;
  });

  const g = article.gradient;

  const gradient =
    g === 'GRADIENT_1'
      ? 'lg:bg-gradient-to-t lg:from-main-blue/70 lg:via-main-blue/25 lg:to-transparent bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent'
      : g === 'GRADIENT_2'
      ? 'lg:bg-gradient-to-t lg:from-main-amarant/70 lg:via-main-amarant/25 lg:to-transparent bg-gradient-to-t from-main-amarant/100 via-main-amarant/45 to-transparent'
      : '';

  return {
    meta: {
      slug: article.slug ?? "",
      title: article.title ?? "",
      lang: article.lang ?? "", 
      category: article.category?.name ?? "",
      SubCategory: (article.subcategories ?? []).map((s: any) => s?.name ?? "").filter(Boolean),
      tags: (article.tags ?? []).map((t: any) => t?.name ?? "").filter(Boolean),
      date: article.publishedAt ?? article.createdAt ?? "",
    },
    hero: {
      img: article.image?.url ?? "",
      imgDesktop: article.image?.cropDesktopUrl ?? "",
      imgMobile: article.image?.cropMobileUrl ?? "",
      gradient,
      tegsBgColor: "",
    },
    author: {
      name: article.authorName ?? article.author?.name ?? "",
      src: article.authorAvatar?.url ?? "",
    },
    body: { ...article.body, blocks },
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const raw = await fetchArticleBySlug(slug);
  if (!raw) return {};
  return buildMetadata({
    path: `/public/Article/${slug}`,
    title: raw.title,
    description: extractDescription(raw.body),
    image: raw.image?.url,
    locale: OG_LOCALE[raw.lang],
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [raw, allRaw] = await Promise.all([
    fetchArticleBySlug(slug),
    fetchAllArticles(),
  ]);

  if (!raw) notFound();

const article = toArticleProps(raw);
console.log("gallery after patch:", JSON.stringify(
  article.body.blocks.filter((b: any) => b.type === "gallery"),
  null, 2
));
const subArticles = allRaw
  .map(toArticleProps)
  .filter(
    (a: ReturnType<typeof toArticleProps>) =>
      a.meta.slug !== article.meta.slug &&
      a.meta.SubCategory.some((s: string) => article.meta.SubCategory.includes(s))
  );
  console.log("article =", article.author);
  const categoryId = await getCategoryId(article.meta.category);

  return (
    <>
      <ClientBg bg="none" />
      <main className="">
        {/* HERO */}
        <ArticleHero
          title={article.meta.title}
          image={article.hero.img}
          imageDesktop={article.hero.imgDesktop}
          imageMobile={article.hero.imgMobile}
          tags={article.meta.tags}
          category={article.meta.category}
          subCategory={article.meta.SubCategory}
          tegsBgColor={article.hero.tegsBgColor}
          date={article.meta.date}
          gradient={article.hero.gradient}
          creator={article.author}
        />

        {/* CONTENT */}
        <article className="mb-4 prose prose-invert max-w-none">
          <div className="pt-8 lg:pt-4 grid grid-cols-12 gap-2 lg:gap-4">
            <div className="col-span-12 lg:col-span-9">
              <ArticleBody blocks={article.body.blocks} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <div className="py-5 px-4 border-b border-t border-main-amarant text-subtitle_2_mobile lg:text-subtitle_2">
                <b>
                  <TranslatedText tKey="article.share" />
                </b>
                <ShareIcons url={absoluteUrl(`/public/Article/${article.meta.slug}`)} />
              </div>
              <ArticleMfkList
                articles={subArticles}
                currentSlug={article.meta.slug}
              />
            </div>
          </div>
        </article>
          <div className="pt-6 border-t border-main-amarant not-prose">
            <BlogSlider categoryId={String(categoryId)} excludeSlug={article.meta.slug} />
          </div>
      </main>
    </>
  );
}