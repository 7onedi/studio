"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "../ArticleSlider/slideContent";

type BlogCardProps = Article & {
  onLoad?: () => void;
};

export const TagButton: React.FC<{ tag: string; ClassName?: string }> = ({
  tag,
  ClassName = "",
}) => (
  <button
    className={`
      px-3 py-1 font-semibold
      backdrop-blur-sm text-white rounded-full
      transition-colors duration-200
      shadow-sm
      ${ClassName}
    `}
  >
    {tag}
  </button>
);

export const BlogCard: React.FC<BlogCardProps> = ({ meta, hero, onLoad }) => {
  // збираємо теги для відображення (category + subcategory + tags)
  const displayTags = Array.from(
    new Set([meta.category, meta.SubCategory, ...(meta.tags ?? [])].filter(Boolean))
  ) as string[];

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-grow overflow-hidden rounded-xl group">
        <Link href={`/Article/${meta.slug}`} className="block h-full w-full">
          <Image
            src={hero.img}
            alt={meta.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 50vw, 100vw"
            onLoad={onLoad}
          />

          <div
            className={`absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/20 ${hero.gradient}`}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-6 lg:p-8">
            <div className="hidden lg:flex flex-wrap gap-2 mb-2">
              {displayTags.map((tag, i) => (
                <TagButton
                  key={`${tag}-${i}`}
                  tag={tag}
                  ClassName="bg-white/20 hover:bg-white/30"
                />
              ))}
            </div>

            <h2 className="text-white text-md sm:text-xl font-bold max-w-full line-clamp-3 leading-tight">
              {meta.title}
            </h2>
          </div>
        </Link>
      </div>

      <div className="pt-2 lg:hidden flex flex-wrap gap-2 mt-3 mb-1">
        {displayTags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="px-3 py-1 text-button_mobile font-semibold bg-main-blue text-white rounded-full shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
