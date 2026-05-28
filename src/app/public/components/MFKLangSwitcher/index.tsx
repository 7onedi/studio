"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

const LANGS = [
  { code: "UK", flag: "🇺🇦", label: "Українська" },
  { code: "EN", flag: "🇬🇧", label: "English" },
  { code: "PL", flag: "🇵🇱", label: "Polski" },
  { code: "LT", flag: "🇱🇹", label: "Lietuviškai" },
  { code: "RO", flag: "🇲🇩", label: "Română" },
];

interface Props {
  selectedLangs: string[];
  onChange: (langs: string[]) => void;
}

export default function LangSwitcher({ selectedLangs, onChange }: Props) {
  const toggle = (code: string) => {
    if (selectedLangs.includes(code)) {
      if (selectedLangs.length === 1) return;
      onChange(selectedLangs.filter((l) => l !== code));
    } else {
      onChange([...selectedLangs, code]);
    }
  };

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {LANGS.map((l) => {
        const isActive = selectedLangs.includes(l.code);
        return (
          <button
            key={l.code}
            onClick={() => toggle(l.code)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition border ${
              isActive
                ? "border-main-amarant bg-white/10"
                : "border-transparent opacity-40 grayscale hover:opacity-60"
            }`}
          >
            <span className="text-2xl">{l.flag}</span>
            <span className="text-xs font-medium">{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}