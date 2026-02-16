import { notFound } from "next/navigation";
import ArticleHero from "@blocks/ArticleHero";
import { slides } from "@blocks/ArticleSlider/slideContent";
import { ArticleBody } from "@blocks/ArticleBody";
import Link from "next/link";
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";
import ArticleMfkList from "@blocks/ArticleMfkList";
import ClientBg from "@/app/providers/ClientBg";

// 🔧 мок даних (пізніше API / Prisma / CMS)
const articles = [...slides];

const iconNames = [
  { title: "facebook", link: "https://www.facebook.com/icyst" },
  { title: "instagram", link: "https://www.instagram.com/intercultural.youth.studio/" },
  { title: "tiktok", link: "https://www.tiktok.com/@pangeya.ultima" },
  { title: "Link", link: "#" },
];

export default function ArticlePage({ params }: any) {
  const article = articles.find(a => a.meta.slug === params.slug);

  if (!article) notFound();

  return (
    <>
      <ClientBg bg="none"/>
      <main className="">
        {/* HERO */}
        <ArticleHero
          title={article.meta.title}
          image={article.hero.img}
          tags={article.meta.tags}
          category={article.meta.category}
          subCategory={article.meta.SubCategory}
          tegsBgColor={article.hero.tegsBgColor}
          date={article.meta.date}
          gradient={article.hero.gradient}
          gradientMob={article.hero.gradientMob}
          creator={article.author}
        />

        {/* CONTENT */}
        <article className="prose prose-invert max-w-none">
          <div className="pt-8 lg:pt-4 grid grid-cols-12 gap-2 lg:gap-4 ">
            <div className="col-span-12 lg:col-span-9 ">
              <ArticleBody blocks={article.body.blocks} />
            </div>
            <div className="col-span-12 lg:col-span-3 ">
              <div className="py-5 border-b border-t border-main-amarant text-subtitle_2_mobile lg:text-subtitle_2">
                <b> Поділитись новиною</b>
                <div className="my-2 flex gap-4 z-20">
                  {iconNames.map((iconName, i) => (
                    <Link key={i} href={iconName.link} className="flex items-center">
                      <Button
                        variant="accent-alt"
                        iconOnly
                        className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                      >
                        <SvgIcon name={iconName.title} size={24} color="main-blue" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
                <ArticleMfkList
                  articles={articles}
                  currentSlug={article.meta.slug}
                />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
