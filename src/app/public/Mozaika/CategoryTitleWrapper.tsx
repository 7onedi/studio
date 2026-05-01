"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { getCategoriesData } from "@/locales/categories";
import CategoryTitle from "@/app/public/blocks/CategoryTitle";

export default function CategoryTitleWrapper({ 
  projectId,
  title,
  image,
  description,
}: { 
  projectId: number;
  title?: string;
  image?: string;
  description?: any;
}) {
  const { locale } = useLanguage();
  const categories = getCategoriesData(locale);
  const project = categories.find(c => c.id === projectId)!;

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