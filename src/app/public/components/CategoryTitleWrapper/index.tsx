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
  presentationTitle?: string | null;
  presentationDescription?: string | null;
  presentationUrl?: string | null;
  presentationTitle_uk?: string | null;
  presentationDescription_uk?: string | null;
  presentationUrl_uk?: string | null;
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

  const presentation = {
    title: parent?.presentationTitle,
    description: parent?.presentationDescription,
    url: parent?.presentationUrl,
    title_uk: parent?.presentationTitle_uk,
    description_uk: parent?.presentationDescription_uk,
    url_uk: parent?.presentationUrl_uk,
  };

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
      presentation={presentation}
    />
  );
}