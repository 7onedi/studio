"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

export default function TranslatedText({ tKey }: { tKey: string }) {
  const { t } = useLanguage();
  return <>{t(tKey)}</>;
}