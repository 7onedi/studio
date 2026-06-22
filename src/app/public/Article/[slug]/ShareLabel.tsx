// ShareLabel.tsx
"use client";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function ShareLabel() {
  const { t } = useLanguage();
  return <b>{t("article.share")}</b>;
}