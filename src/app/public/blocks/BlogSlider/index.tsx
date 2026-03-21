"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { groupArticles } from "./data";
import { BlogCard } from "./BlogCard";
import { toCardProps } from './toCardProps';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// ─── helpers ─────────────────────────────────────────────────────────────────

async function fetchSliderArticles(categoryId?: string): Promise<any[]> {
  console.log("Fetching articles for category:", categoryId);
  const params = new URLSearchParams({
    limit: "100",
    sortBy: "publishedAt",
    order: "desc",
    published: "true",
    categoryId: categoryId ?? "",
  });
  const res = await fetch(`${BASE_URL}/api/articles/search?${params}`);
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  const all = Array.isArray(data?.data) ? data.data : [];
  return categoryId
    ? all
    : all.filter((a: any) => a.slider === "SLIDER_2");
}

// ─── Arrow ────────────────────────────────────────────────────────────────────

interface ArrowProps {
  onClick: () => void;
  disabled: boolean;
  direction: "left" | "right";
}

const Arrow: React.FC<ArrowProps> = ({ onClick, disabled, direction }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      absolute top-1/2 -translate-y-1/2
      flex items-center justify-center
      w-[72px] h-[72px]
      bg-indigo-50 rounded-full
      transition-all duration-300 hover:bg-white
      z-30
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${direction === "left" ? "left-[-25px]" : "right-[-25px]"}
    `}
    aria-label={direction === "left" ? "Попередній слайд" : "Наступний слайд"}
  >
    <SvgIcon name={direction} size={24} color="main-blue" />
  </button>
);

// ─── BlogSlider ───────────────────────────────────────────────────────────────

export default function BlogSlider({ categoryId }: { categoryId?: string }) {
  const maxMobileArticles = 4;

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderReady, setSliderReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [visibleCount, setVisibleCount] = useState(maxMobileArticles);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    fetchSliderArticles(categoryId)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [categoryId]);

  // Групуємо по 4 — кожна група = 1 слайд
  const slidesData = useMemo(() => groupArticles(articles, 4), [articles]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1, spacing: 0 },
    created() {
      setSliderReady(true);
    },
  });

  // Оновлюємо слайдер після зміни даних
  useEffect(() => {
    instanceRef.current?.update();
  }, [slidesData, instanceRef]);

  const handleImageLoad = useCallback(() => {}, []);

  const visibleMobileItems = useMemo(
    () => articles.slice(0, visibleCount),
    [articles, visibleCount]
  );

  const canToggle = articles.length > maxMobileArticles;
  const isAllVisible = visibleCount >= articles.length;

  if (!isClient) return null;
  if (!loading && articles.length === 0) return null;

  return (
    <div className="mx-auto w-full">
      <div className="relative">
        {/* ── DESKTOP ── */}
        <div className="relative hidden lg:block">
          {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 rounded-xl">
              <span className="text-gray-400 text-sm animate-pulse">
                Завантаження...
              </span>
            </div>
          )}

          <div
            ref={sliderRef}
            className="keen-slider w-full h-[600px] sm:h-[800px] lg:h-[800px]"
          >
            {slidesData.map((group: any[], i: number) => (
              <div
                key={i}
                className="keen-slider__slide grid h-full w-full grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8"
              >
                {group.map((article: any, j: number) => (
                  <BlogCard
                    key={j}
                    {...toCardProps(article)}
                    onLoad={handleImageLoad}
                  />
                ))}
              </div>
            ))}
          </div>

          {sliderReady && slidesData.length > 1 && (
            <>
              <Arrow
                direction="left"
                disabled={false}
                onClick={() => instanceRef.current?.prev()}
              />
              <Arrow
                direction="right"
                disabled={false}
                onClick={() => instanceRef.current?.next()}
              />
            </>
          )}
        </div>

        {/* ── MOBILE ── */}
        <div id="blogList" className="grid grid-cols-1 gap-4 lg:hidden">
          {visibleMobileItems.map((article: any, index: number) => (
            <div key={index} className="h-[250px] sm:h-[300px]">
              <BlogCard
                {...toCardProps(article)}
                onLoad={handleImageLoad}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Мобайл: показати ще / згорнути */}
      {canToggle && (
        <div className="mt-6 flex justify-center lg:hidden">
          <Button
            variant="primary"
            onClick={() => {
              if (isAllVisible) {
                setVisibleCount(maxMobileArticles);
                document
                  .getElementById("blogList")
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                setVisibleCount((prev) =>
                  Math.min(prev + maxMobileArticles, articles.length)
                );
              }
            }}
          >
            {isAllVisible ? "Згорнути" : "ДИВИТИСЬ ЩЕ"}
            <div className="ml-2 flex items-center justify-center">
              <SvgIcon
                name={isAllVisible ? "up" : "down"}
                size={24}
                color="white"
              />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}