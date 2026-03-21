"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "../ArticleSlider/slideContent";
import { useRouter } from "next/navigation";

type BlogCardProps = Article & {
  onLoad?: () => void;
};

export const TagButton: React.FC<{ tag: string; ClassName?: string }> = ({
  tag,
  ClassName = "",
}) => {
  const router = useRouter();
  const SEARCH_ROUTE = "/public/Search";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/public/Search?q=${encodeURIComponent(tag)}`);
      }}
      className={`
        px-3 py-1 font-semibold
        backdrop-blur-sm text-white rounded-full
        transition-colors duration-200
        shadow-sm whitespace-nowrap
        ${ClassName}
      `}
    >
      {tag}
    </button>
  );
};

export const BlogCard: React.FC<BlogCardProps> = ({ meta, hero, onLoad }) => {
  // збираємо теги для відображення (category + subcategory + tags)
  console.log("BlogCard meta:", meta);
const categoryTags = Array.from(
  new Set([meta.category, meta.SubCategory].filter(Boolean))
) as string[];

const tagTags = Array.from(
  new Set([...(meta.tags ?? [])].filter(Boolean))
) as string[];

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-grow overflow-hidden rounded-xl group">
        <Link href={`/public/Article/${meta.slug}`} className="block h-full w-full">
          {hero.img ? (
            <Image
              src={hero.img}
              alt={meta.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
              onLoad={onLoad}
            />
          ) : (
              <div className="absolute inset-0 bg-gray-200" /> // плейсхолдер
          )}
            <div
              className={`absolute inset-0 transition-all duration-300 group-hover:opacity-90 ${hero.gradient || 'bg-black/30'}`}
            />

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-6 lg:p-8">
            <div className="hidden lg:flex flex-wrap gap-2 mb-2">
              {categoryTags.map((tag, i) => (
                <TagButton key={`cat-${tag}-${i}`} tag={tag} ClassName="bg-main-amarant hover:bg-main-amarant/80 whitespace-nowrap" />
              ))}
              {tagTags.map((tag, i) => (
                <TagButton key={`tag-${tag}-${i}`} tag={tag} ClassName="bg-main-blue hover:bg-main-blue/80 whitespace-nowrap" />
              ))}
            </div>

            <h2 className="text-white text-md sm:text-xl font-bold max-w-full line-clamp-3 leading-tight">
              {meta.title}
            </h2>
          </div>
        </Link>
      </div>

      <div className="pt-2 lg:hidden flex flex-wrap gap-2 mt-3 mb-1">
        {categoryTags.map((tag, i) => (
          <TagButton key={`cat-${tag}-${i}`} tag={tag} ClassName="bg-main-amarant hover:bg-main-amarant/80 whitespace-nowrap" />
        ))}
        {tagTags.map((tag, i) => (
          <TagButton key={`tag-${tag}-${i}`} tag={tag} ClassName="bg-main-blue hover:bg-main-blue/80 whitespace-nowrap" />
        ))}
      </div>
    </div>
  );
};
