"use client";

import { getCategoriesData } from "@/locales/categories";
import styles from './Categories.module.scss';
import { Button } from "@/app/public/components/Button";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import CategoriesGrid from "./CategoriesGrid";

export const CategoriesSection = () => {
  const { locale, t } = useLanguage();
  const categories = getCategoriesData(locale);
  const router = useRouter();

  return (
    <section className="m-auto w-full flex flex-col items-center gap-10 lg:gap-0 lg:pt-0">
      <div className="w-full xl:mt-16 lg:px-8">
        <CategoriesGrid categories={categories} />
      </div>

      {/* Кнопка */}
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