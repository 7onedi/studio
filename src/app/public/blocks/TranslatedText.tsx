"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

export default function TranslatedText({ 
  tKey, 
  className 
}: { 
  tKey: string; 
  className?: string; 
}) {
  const { t } = useLanguage();
  return <p className={className}>{t(tKey)}</p>;
}