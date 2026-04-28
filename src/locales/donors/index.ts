import { donorsDataEn } from "./en";
import { donorsDataUk } from "./uk";
import { donorsDataLt } from "./lt";
import { donorsDataPl } from "./pl";
import { donorsDataRo } from "./ro";
import type { Locale } from "@/app/providers/LanguageProvider";

const DonorLocales = {
  uk: donorsDataUk,
  en: donorsDataEn,
  lt: donorsDataLt,
  pl: donorsDataPl,
  ro: donorsDataRo,
};

export function getDonorData(locale: Locale) {
  return DonorLocales[locale] ?? DonorLocales.uk;
}