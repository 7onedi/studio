"use client";

import React from "react";
import Link from "next/link";

// Заглушка для Image. У Next.js краще next/image
const Image = (props: any) => {
  return (
    <img
      src={props.src}
      alt={props.alt}
      style={{
        position: props.fill ? "absolute" : "static",
        width: props.fill ? "100%" : "auto",
        height: props.fill ? "100%" : "auto",
        objectFit: props.className?.includes("object-cover") ? "cover" : "contain",
        borderRadius: props.className?.includes("rounded-xl") ? "0.75rem" : "0",
        transition: "transform 0.5s",
      }}
      onLoad={props.onLoad}
      className={props.className}
    />
  );
};

interface ArticleCardProps {
  title: string;
  gradient: string;
  img: string;
  link: string;
  tags: readonly string[];
  onLoad?: () => void;
}

export const TagButton: React.FC<{ tag: string; className?: string }> = ({ tag, className = "" }) => (
  <button
    className={`
      px-3 py-1 text-xs font-semibold
      bg-white/20 backdrop-blur-sm text-white rounded-full
      transition-colors duration-200 hover:bg-white/30
      shadow-sm
      ${className}
    `}
  >
    <Link href="https://stina.pangeya.org.ua/selo-stina">{tag}</Link>
  </button>
);

export const BlogCard: React.FC<ArticleCardProps> = ({ title, gradient, img, link, tags, onLoad }) => (
  // 💡 Використовуємо flex-col для мобільного, щоб теги розміщувалися під карткою
  // 💡 h-full збережено для коректного відображення в сітці
  <div className="flex flex-col h-full">
    {/* 1. Блок Картки з Посиланням (Залишається як основний візуальний елемент) */}
    <div className="relative rounded-xl overflow-hidden cursor-pointer group flex-grow">
      <Link href={link}>
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={onLoad}
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/20 ${gradient}`} />

        {/* Content (Title + Desktop Tags) */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8 z-90">
          
          {/* 🚩 ТЕГИ ДЛЯ ДЕСКТОПУ (Visible on lg and up, Hidden on mobile) */}
          <div className="hidden lg:flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <TagButton key={i} tag={tag} />
            ))}
          </div>

          <h2 className="text-white text-md sm:text-xl font-bold max-w-full line-clamp-3 leading-tight">
            {title}
          </h2>
        </div>
      </Link>
    </div>

    {/* 2. Блок Тегів для Мобільного (Visible only on mobile, Hidden on lg and up) */}
    <div className="pt-2 lg:hidden flex flex-wrap gap-2 mt-3 mb-1">
      {tags.map((tag, i) => (
        // 💡 Для мобільної версії змінюємо стилі тегів, щоб вони не були прозорими
        <button
          key={i}
          className={`
            px-3 py-1 text-button_mobile font-semibold
            bg-main-blue text-white rounded-full /* 💡 Змінено стилі для фону під карткою */
            transition-colors duration-200 hover:bg-gray-200
            shadow-sm
          `}
        >
          <Link href="https://stina.pangeya.org.ua/selo-stina">{tag}</Link>
        </button>
      ))}
    </div>
  </div>
);