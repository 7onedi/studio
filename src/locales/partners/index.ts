import { partnersDataEn } from "./en";
import { partnersDataUk } from "./uk";
import { partnersDataLt } from "./lt";
import { partnersDataPl } from "./pl";
import { partnersDataRo } from "./ro";
import type { Locale } from "@/app/providers/LanguageProvider";

const PartnerLocales = {
  uk: partnersDataUk,
  en: partnersDataEn,
  lt: partnersDataLt,
  pl: partnersDataPl,
  ro: partnersDataRo,
};

export function getPartnerData(locale: Locale) {
  return PartnerLocales[locale] ?? PartnerLocales.uk;
}