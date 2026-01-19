"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SvgIcon } from "@components/SvgIcon";

type ArticleListItem = {
  meta: {
    slug: string;
    title: string;
  };
  hero: {
    img: string;
  };
};

type ArticleMfkListProps = {
  articles: readonly ArticleListItem[];
  currentSlug: string;
  initialVisibleCount?: number;
};

export default function ArticleMfkList({
  articles,
  currentSlug,
  initialVisibleCount = 4,
}: ArticleMfkListProps) {
  /** 1️⃣ прибираємо поточну статтю */
  const filteredArticles = useMemo(
    () => articles.filter(a => a.meta.slug !== currentSlug),
    [articles, currentSlug]
  );

  /** 2️⃣ керуємо видимістю */
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const visibleItems = useMemo(
    () => filteredArticles.slice(0, visibleCount),
    [filteredArticles, visibleCount]
  );

  const canToggle = filteredArticles.length >= 8;
  const isAllVisible = visibleCount >= filteredArticles.length;

  return (
    <div id="mfkList" className="flex flex-col gap-4">
      {visibleItems.map(item => (
        <Link
          key={item.meta.slug}
          href={`/Article/${item.meta.slug}`}
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 no-underline transition hover:bg-white/10"
        >
          {/* IMAGE */}
          <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full">
            <Image
              src={item.hero.img}
              alt={item.meta.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          {/* TITLE */}
          <div className="flex-1 text-subtitle_2_mobile font-medium leading-snug">
            {item.meta.title}
          </div>
        </Link>
      ))}

      {/* 3️⃣ кнопка показу тільки якщо є сенс */}
      {canToggle && (
        <button
          type="button"
          onClick={() => {
            if (isAllVisible) {
              setVisibleCount(initialVisibleCount);
              document
                .getElementById("mfkList")
                ?.scrollIntoView({ behavior: "smooth" });
            } else {
              setVisibleCount(prev =>
                Math.min(prev + initialVisibleCount, filteredArticles.length)
              );
            }
          }}
          className="mx-auto mt-2 px-8 py-3 rounded-full bg-main-amarant text-white font-semibold hover:opacity-90 transition"
        >
          {isAllVisible ? (
            <div className="flex">
              Згорнути
              <span className="ml-2 flex items-center">
                <SvgIcon name="up" size={24} color="white" />
              </span>
            </div>
          ) : (
            <div className="flex">
              Показати ще
              <span className="ml-2 flex items-center">
                <SvgIcon name="down" size={24} color="white" />
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}