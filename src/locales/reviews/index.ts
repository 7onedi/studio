import { reviewsDataUk } from "./uk";
import { reviewsDataEn } from "./en";
import { reviewsDataLt } from "./lt";
import { reviewsDataPl } from "./pl";
import { reviewsDataRo } from "./ro";
import type { Locale } from "@/app/providers/LanguageProvider";

const reviewsLocales = {
  uk: reviewsDataUk,
  en: reviewsDataEn,
  lt: reviewsDataLt,
  pl: reviewsDataPl,
  ro: reviewsDataRo,
};

export function getreviewsData(locale: Locale) {
  return reviewsLocales[locale] ?? reviewsLocales.uk;
}