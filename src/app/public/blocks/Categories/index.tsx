"use client";

import { getCategoriesData } from "@/locales/categories";
import styles from './Categories.module.scss';
import { Button } from "@/app/public/components/Button";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import CategoriesGrid from "./CategoriesGrid";
import { useState } from "react";

function CategoriesSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Десктоп — 4 полігони в ряд */}
      <div className="hidden md:flex items-center justify-center gap-2 h-[400px]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-2xl"
            style={{
              width: 200,
              height: i % 2 === 0 ? 380 : 340,
              marginTop: i % 2 === 1 ? 60 : 0,
              clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
            }}
          />
        ))}
      </div>

      {/* Мобільний — 4 блоки вертикально */}
      <div className="flex md:hidden flex-col gap-4 px-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-2xl h-[180px] w-full"
            style={{
              clipPath: i % 2 === 1
                ? "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)"
                : "polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const CategoriesSection = () => {
  const { locale, t } = useLanguage();
  const categories = getCategoriesData(locale);
  const router = useRouter();

  // Скільки зображень завантажилось
  const [loadedCount, setLoadedCount] = useState(0);
  const ready = loadedCount >= 1; // показуємо після першого

  return (
    <section className="m-auto w-full flex flex-col items-center gap-10 lg:gap-0 lg:pt-0">
      <div className="w-full xl:mt-16 lg:px-8 relative">

        {/* Skeleton — зникає після ready */}
        {!ready && (
          <div className="absolute inset-0 z-10">
            <CategoriesSkeleton />
          </div>
        )}

        {/* Grid — завжди в DOM, fade-in після ready */}
        <div className={`transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
          <CategoriesGrid
            categories={categories}
            onImageLoad={() => setLoadedCount(c => c + 1)}
          />
        </div>
      </div>

      <div className={`${styles["button_primary"]} flex flex-cols justify-between items-center`}>
        <Image src="/categories/CB_LeftArrow.svg" alt="Left Arrow" width={66} height={41} />
        <Button
          variant="primary"
          className="mx-6 lg:w-[500px]"
          onClick={() => router.push('/public/AboutNetwork#joinUs')}>
          {t("join.join_us")}
        </Button>
        <Image src="/categories/CB_RightArrow.svg" alt="Right Arrow" width={66} height={41} />
      </div>
    </section>
  );
};