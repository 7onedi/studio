"use client";
import Image from "next/image";
import { TagButton } from "@/app/public/blocks/BlogSlider/BlogCard";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

type ArticleHeroProps = {
  title: string;
  image: string;

  tags?: readonly string[];

  category?: string;
  subCategory?: string;

  tegsBgColor?: string;
  date?: string;
  gradient?: string;
  creator?: { name: string; src: string };
};

export default function ArticleHero({
  title,
  image,
  tags = [],
  category,
  subCategory,
  tegsBgColor,
  date,
  gradient,
  creator = { name: "", src: "" },
}: ArticleHeroProps) {
  const { t, locale } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryTags = Array.from(
    new Set([category, subCategory].filter(Boolean))
  ) as string[];

  const tagTags = Array.from(
    new Set([...(tags ?? [])].filter(Boolean))
  ) as string[];

  const formattedDate = formatDate(date ?? "");

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const localeMap: Record<string, string> = {
      uk: 'uk-UA',
      en: 'en-GB',
      pl: 'pl-PL',
      lt: 'lt-LT',
      ro: 'ro-RO',
    };
    return date.toLocaleDateString(localeMap[locale] ?? 'uk-UA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div>
      <section className="bg-transparent relative w-full h-[700px] mb-8 lg:mb-16 overflow-hidden rounded-3xl">

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl" />
        )}

        <Image
          src={image}
          alt={title}
          fill
          priority
          onLoad={() => setImageLoaded(true)}
          className={`h-[700px] w-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {gradient && <div className={`absolute inset-0 ${gradient}`} />}

        <div className="absolute lg:bottom-8 inset-0 flex flex-col justify-end items-center px-8 lg:px-16">
          <div className="lg:mb-8 text-white text-headline_5_mobile lg:text-headline_1">
            {title}
          </div>

          <div className="invisible lg:visible px-20 flex flex-row grid grid-cols-12 w-full gap-8 lg:gap-16">
            <div className="hidden lg:flex flex-row items-center col-span-4 lg:col-span-4 gap-4">
              <div className="h-[80px] rounded-full w-[80px] relative mb-4 overflow-hidden">
                {creator?.src ? (
                  <Image
                    src={creator.src}
                    alt={creator.name}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <Avatar
                    src="/images/profile/user-1.jpg"
                    sx={{ width: 80, height: 80 }}
                  />
                )}
              </div>
              <div className="text-Headline_5_mobile lg:text-Headline_5 text-white text h-auto">
                <span>{t("article.author")}:</span>
                <div>
                  <b>{creator?.name}</b>
                </div>
              </div>
            </div>

              {(categoryTags.length > 0 || tagTags.length > 0) && (
                <div className="flex justify-center items-center col-span-4 lg:col-span-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    {categoryTags.map((tag, i) => (
                      <TagButton
                        key={`cat-${tag}-${i}`}
                        tag={tag}
                        ClassName="bg-main-amarant hover:bg-main-amarant/80 whitespace-nowrap"
                      />
                    ))}
                    {tagTags.map((tag, i) => (
                      <TagButton
                        key={`tag-${tag}-${i}`}
                        tag={tag}
                        ClassName="bg-main-blue hover:bg-main-blue/80 whitespace-nowrap"
                      />
                    ))}
                  </div>
                </div>
              )}


            <div className="text-right relative flex justify-end items-center col-span-4 lg:col-span-4">
              {date && (
                <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5 text-white">
                  <b>{formattedDate}</b>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="lg:hidden grid grid-cols-12 w-full">
        {(categoryTags.length > 0 || tagTags.length > 0) && (
          <div className="flex justify-center items-center col-span-12 lg:col-span-4">
            <div className="flex flex-wrap gap-2">
              {categoryTags.map((tag, i) => (
                <TagButton
                  key={`cat-${tag}-${i}`}
                  tag={tag}
                  ClassName="bg-main-amarant hover:bg-main-amarant/80 text-button"
                />
              ))}
              {tagTags.map((tag, i) => (
                <TagButton
                  key={`tag-${tag}-${i}`}
                  tag={tag}
                  ClassName="bg-main-blue hover:bg-main-blue/80 text-button"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-row items-center col-span-6 lg:col-span-4 gap-4">
          <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full shrink-0">
            {creator?.src ? (
              <Image
                src={creator.src}
                alt={creator.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <Avatar
                src="/images/profile/user-1.jpg"
                sx={{ width: 80, height: 80 }}
              />
            )}
          </div>

          <div className="text-Headline_5_mobile lg:text-Headline_5 h-auto">
            <b>{t("article.author")}:</b>
            <div>
              <b>{creator?.name}</b>
            </div>
          </div>
        </div>

        <div className="text-right relative flex justify-end items-center col-span-6 lg:col-span-4">
          {date && (
            <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5">
              <b>{formattedDate}</b>
            </span>
          )}
        </div>
      </div>
   </div>
  );
}