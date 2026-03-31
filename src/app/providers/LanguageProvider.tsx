"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import uk from "@/locales/uk.json";
import en from "@/locales/en.json";
import lt from "@/locales/lt.json";
import pl from "@/locales/pl.json";
import ro from "@/locales/ro.json";

export type Locale = "uk" | "en" | "lt" | "pl" | "ro";

const translations = { uk, en, lt, pl, ro };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // ключовий момент — починаємо з null, не з "uk"
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    // читаємо localStorage тільки на клієнті після mount
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && saved in translations) {
      setLocaleState(saved);
    } else {
      setLocaleState("uk");
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    const currentLocale = locale ?? "uk";
    const keys = key.split(".");
    let result: unknown = translations[currentLocale];
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        let fallback: unknown = translations["uk"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = (fallback as Record<string, unknown>)[fk];
          } else return key;
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof result === "string" ? result : key;
  };

  // поки locale не визначено — не рендеримо дітей
  // щоб уникнути mismatch між сервером і клієнтом
  if (locale === null) return null;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}