import type { CategoryData } from "./types";

import { categoriesDataUk } from "./uk";
import { categoriesDataEn } from "./en";
import { categoriesDataLt } from "./lt";
import { categoriesDataPl } from "./pl";
import { categoriesDataRo } from "./ro";
import type { Locale } from "@/app/providers/LanguageProvider";

const CategoryLocales = {
  uk: categoriesDataUk,
  en: categoriesDataEn,
  lt: categoriesDataLt,
  pl: categoriesDataPl,
  ro: categoriesDataRo,
};

export function getCategoriesData(locale: Locale): CategoryData[] {
  return CategoryLocales[locale] ?? CategoryLocales.uk;
}