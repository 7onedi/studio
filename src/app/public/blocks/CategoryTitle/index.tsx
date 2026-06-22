"use client";

import Image from "next/image";
import { ArticleBody } from '@blocks/ArticleBody';
import { useLanguage } from "@/app/providers/LanguageProvider";

interface ProjectPreviewBlockProps {
  image: string;
  pattern: string;
  gradient: string;
  hoverGradient: string;
  title: string;
  description?: { blocks: any[] };
}

export default function ProjectPreviewBlock({
  image,
  pattern,
  gradient,
  hoverGradient,
  title,
  description,
}: ProjectPreviewBlockProps) {
  const { t } = useLanguage();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 ">
      
      {/* LEFT — VISUAL */}
      <div className="relative w-full h-[145px] lg:h-[335px] overflow-hidden group rounded-[20px]">
        
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">

          <Image
            src={image}
            alt={title}
            fill
            className="object-cover z-10"
          />

          <div
            className={`absolute inset-0 z-20 bg-gradient-to-br ${gradient}`}
          />

          <Image
            src={pattern}
            alt="pattern"
            fill
            className="object-cover z-30 pointer-events-none"
          />

          <div
            className={`
              absolute inset-0 z-40 bg-gradient-to-br
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              ${hoverGradient}
            `}
          />
        </div>

        {/* ТЕКСТ */}
        <div className="mt-6 absolute inset-0 flex items-top justify-center pointer-events-none z-50">
            <span className="text-white font-bold text-xl lg:text-headline_1 text-center px-4">
              {title}
            </span>
        </div>
      </div>

      {/* RIGHT — CONTENT */}
      <div className="flex items-center lg:items-start flex-col gap-6 lg:gap-8 text-main-text">
        <h1 className="text-headline_4_mobile lg:text-headline_4 font-bold text-main-text">
          {t('pages.project_preview_block.description_title')}
        </h1>
        
        <div className="text-body_mobile lg:text-body leading-relaxed w-full">
          {description?.blocks && <ArticleBody blocks={description.blocks} />}
        </div>

      </div>
    </section>
  );
}