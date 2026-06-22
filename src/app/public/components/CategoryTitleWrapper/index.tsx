"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { getCategoriesData } from "@/locales/categories";
import CategoryTitle from "@/app/public/blocks/CategoryTitle";

interface ParentBody {
  body?: any;
  body_en?: any;
  body_pl?: any;
  body_lt?: any;
  body_ro?: any;
}

export default function CategoryTitleWrapper({
  projectId,
  title,
  image,
  parent,
}: {
  projectId: number;
  title?: string;
  image?: string;
  parent?: ParentBody | null;
}) {
  const { locale } = useLanguage();
  const categories = getCategoriesData(locale);
  const project = categories.find(c => c.id === projectId)!;

  const bodyByLocale: Record<string, any> = {
    uk: parent?.body,
    en: parent?.body_en,
    pl: parent?.body_pl,
    lt: parent?.body_lt,
    ro: parent?.body_ro,
  };

  const description = bodyByLocale[locale];

  return (
    <CategoryTitle
      image={image ?? project.image}
      pattern={project.pattern}
      gradient={project.gradient}
      hoverGradient={project.hoverGradient}
      title={title ?? project.title}
      description={description}
    />
  );
}