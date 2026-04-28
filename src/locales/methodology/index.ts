import { methodologyDataUk } from "./uk";
import { methodologyDataEn } from "./en";
import { methodologyDataLt } from "./lt";
import { methodologyDataPl } from "./pl";
import { methodologyDataRo } from "./ro";
import type { Locale } from "@/app/providers/LanguageProvider";

const methodologyLocales = {
  uk: methodologyDataUk,
  en: methodologyDataEn,
  lt: methodologyDataLt,
  pl: methodologyDataPl,
  ro: methodologyDataRo,
};

export function getMethodologyData(locale: Locale) {
  return methodologyLocales[locale] ?? methodologyLocales.uk;
}