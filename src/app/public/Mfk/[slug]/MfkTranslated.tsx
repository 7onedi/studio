"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { ArticleBody } from '@blocks/ArticleBody';

function getLocalized(child: any, field: string, locale: string) {
  if (locale === 'uk') return child[field] || child[`${field}_en`];
  return child[`${field}_${locale}`] || child[`${field}_en`] || child[field];
}

export function MfkTranslatedTitle({ child }: { child: any }) {
  const { locale } = useLanguage();
  return <>{getLocalized(child, 'title', locale)}</>;
}

export function MfkTranslatedBody({ child }: { child: any }) {
  const { locale } = useLanguage();
  const body = getLocalized(child, 'body', locale);

  if (!body?.blocks?.length) return null;

  return <ArticleBody blocks={body.blocks as any[]} />;
}