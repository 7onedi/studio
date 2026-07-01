"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { useLanguage } from "@/app/providers/LanguageProvider";
import type { RichTextItem } from "@/app/public/components/RenderRichText";

interface PopupContent {
  slug?: string;
  title: string;
  title_en?: string | null;
  title_pl?: string | null;
  title_lt?: string | null;
  title_ro?: string | null;
  description?: string | string[] | RichTextItem[];
  Logo?: string;
  zoom?: boolean;
  lang?: string;
}

interface MfkListProps {
  markers: { popupContent: PopupContent }[];
  id?: string;
}

const ROW_PATTERN = [4, 3, 4, 3, 4];

function splitIntoRows<T>(items: T[]) {
  const rows: T[][] = [];
  let index = 0;
  for (const count of ROW_PATTERN) {
    if (index >= items.length) break;
    rows.push(items.slice(index, index + count));
    index += count;
  }
  return rows;
}

export default function MfkList({ markers, id }: MfkListProps) {
  const { t, locale } = useLanguage();

  const getTitle = (item: PopupContent) => {
    const map: Record<string, string | null | undefined> = {
      uk: item.title,
      en: item.title_en,
      pl: item.title_pl,
      lt: item.title_lt,
      ro: item.title_ro,
    };
    return map[locale] || item.title_en || item.title;
  };

const LANGS = [
  { code: 'UK', icon: '/flags/UA.svg', label: t("nav.locale.uk") },
  // { code: 'EN', icon: '/flags/GB.svg', label: t("nav.locale.en") },
  { code: 'PL', icon: '/flags/PL.svg', label: t("nav.locale.pl") },
  { code: 'LT', icon: '/flags/LT.svg', label: t("nav.locale.lt") },
  { code: 'RO', icon: '/flags/RO.svg', label: t("nav.locale.md") },
];
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    LANGS.map((l) => l.code)
  );

  const toggleLang = (code: string) => {
    setSelectedLangs((prev) => {
      if (prev.includes(code)) {
        // не дозволяємо зняти всі — мінімум одна активна
        if (prev.length === 1) return prev;
        return prev.filter((l) => l !== code);
      }
      return [...prev, code];
    });
    setVisibleCount(4);
  };

  const items = markers
    .map((m) => m.popupContent)
    .filter((p) => !p.lang || selectedLangs.includes(p.lang.toUpperCase()));

  const [visibleCount, setVisibleCount] = useState(4);
  const mobileItems = items.slice(0, visibleCount);
  const isAllVisible = visibleCount >= items.length;
  const rows = splitIntoRows(items);

  const Card = (item: PopupContent) => {
    const icon = LANGS.find((l) => l.code === item.lang)?.icon;
    return (
      <div className="relative group">
        <div className={`bg-transparent overflow-hidden rounded-t-2xl border-b-2 ${id === "#mfk" ? "border-main-amarant" : "border-none"}`}>
          <div className="relative h-[220px] w-full">
            <Image
              src={item.Logo!}
              alt={getTitle(item) ?? item.title}
              fill
              className={`${!item.zoom ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
            />
            {icon && (
              <div className="absolute bottom-2 right-2 text-2xl leading-none drop-shadow-md">
                <img src={icon} width={36} height={36} alt={item.lang} style={{ borderRadius: 2 }} />
              </div>
            )}
          </div>
        </div>

        <div className={`absolute text-center left-1/2 -translate-x-1/2 -bottom-4 px-6 py-2 ${id === "#mfk" ? "bg-main-amarant border-main-amarant" : "bg-main-blue border-main-blue"} text-white text-sm font-semibold rounded-full border-b-2`}>
          {getTitle(item)}
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-10" id="mfkList">

      {/* СВІТЧЕР МОВ */}
      { (id === '#CountrysideStudio' || id === 'Imagemapping') &&
        <div className="flex justify-center gap-6 flex-wrap">
          {LANGS.map((l) => {
            const isActive = selectedLangs.includes(l.code);
            return (
              <button
                key={l.code}
                onClick={() => toggleLang(l.code)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white/10"
                    : "opacity-40 grayscale hover:opacity-60 hover:grayscale-0"
                }`}
              >
                {l.icon && (
                  <img src={l.icon} width={36} height={36} alt={l.label} style={{ borderRadius: 2 }} />
                )}
                <span className="text-xs font-medium">{l.label}</span>
              </button>
            );
          })}
        </div>
      }

      {/* MOBILE */}
      <div className="flex flex-col gap-8 md:hidden">
        {mobileItems.map((item, index) => (
          <Link key={index} href={`${id === "#mfk" ? "/public/Mfk" : "/public/Festival"}/${item.slug}`}>
            {Card(item)}
          </Link>
        ))}

        <button
          onClick={() => {
            if (isAllVisible) {
              setVisibleCount(4);
              document.getElementById("mfkList")?.scrollIntoView({ behavior: "smooth" });
            } else {
              setVisibleCount((prev) => prev === 4 ? prev + 3 : prev + 4);
            }
          }}
          className="mx-auto mt-6 px-8 py-3 rounded-full bg-main-amarant text-white font-semibold hover:opacity-90 transition"
        >
          {isAllVisible ? (
            <div className="flex">
              {t("public.mfkList.showLess")}
              <span className="ml-2 flex items-center"><SvgIcon name="up" size={24} color="white" /></span>
            </div>
          ) : (
            <div className="flex">
              {t("public.mfkList.showMore")}
              <span className="ml-2 flex items-center"><SvgIcon name="down" size={24} color="white" /></span>
            </div>
          )}
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex flex-col gap-10">
        {rows.map((row, rowIndex) => {
          const expectedCols = ROW_PATTERN[rowIndex];
          const isThreeRow = expectedCols === 3;
          return (
            <div
              key={rowIndex}
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${expectedCols}, minmax(0, 1fr))`,
                paddingInline: isThreeRow ? "16.666%" : undefined,
              }}
            >
              {row.map((item, index) => (
                <Link key={index} href={`${id === "#mfk" ? "/public/Mfk" : "/public/Festival"}/${item.slug}`}>
                  {Card(item)}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

    </section>
  );
}