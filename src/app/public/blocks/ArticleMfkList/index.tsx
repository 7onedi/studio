"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import ArticleMfkList from "./ArticleMfkList";

export default function ArticleMfkListClient({ articles, currentSlug }: {
  articles: any[];
  currentSlug: string;
}) {
  const { locale } = useLanguage();
  const filtered = articles.filter(a => !a.meta.lang || a.meta.lang.toLowerCase() === locale);
  return <ArticleMfkList articles={filtered} currentSlug={currentSlug} />;
}