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
function BlogSliderSkeleton({ count }: { count?: number }) {
  const total = count ?? 4;
  const gridClass =
    total === 1 ? 'grid-cols-1 grid-rows-1' :
    total === 2 ? 'grid-cols-2 grid-rows-1' :
    'grid-cols-2 grid-rows-2';
  const heightClass = total <= 2 ? 'h-[400px]' : 'h-[800px]';

  return (
    <div className={`hidden lg:grid w-full gap-4 lg:gap-8 ${gridClass} ${heightClass} animate-pulse`}>
      {Array.from({ length: Math.min(total, 4) }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded-xl ${
            total === 1 ? 'col-start-1 col-end-2 w-1/2 mx-auto' :
            total === 3 && i === 2 ? 'col-start-1 col-end-3 w-1/2 mx-auto' : ''
          }`}
        />
      ))}
    </div>
  );
}

async function fetchSliderArticles(categoryId?: string, subcategoryId?: string): Promise<any[]> {
  console.log("Fetching articles for category:", categoryId);
  const params = new URLSearchParams({
    limit: "100",
    sortBy: "publishedAt",
    order: "desc",
    published: "true",
    categoryId: categoryId ?? "",
    subcategoryId: subcategoryId ?? "",
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

export default function BlogSlider({ categoryId, excludeSlug, subcategoryId }: { 
  categoryId?: string; 
  excludeSlug?: string;
  subcategoryId?: string;
}) {
  const maxMobileArticles = 4;

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderReady, setSliderReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [visibleCount, setVisibleCount] = useState(maxMobileArticles);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    fetchSliderArticles(categoryId, subcategoryId)
      .then(data => setArticles(excludeSlug ? data.filter((a: any) => a.slug !== excludeSlug) : data))
      .finally(() => setLoading(false));
  }, [categoryId, excludeSlug, subcategoryId]);

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
          {loading && <BlogSliderSkeleton />}

          <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}>
            <div ref={sliderRef} className={`keen-slider w-full ${articles.length <= 2 ? 'h-[400px]' : 'h-[800px]'}`}>
              {slidesData.map((group: any[], i: number) => {
                const count = group.length;
                const totalCount = articles.length;

              const gridClass = 
                totalCount === 1 ? 'grid-cols-1 grid-rows-1' :
                totalCount === 2 ? 'grid-cols-2 grid-rows-1' :
                totalCount === 3 ? 'grid-cols-2 grid-rows-2' :
                'grid-cols-2 grid-rows-2';

              const heightClass =
                totalCount === 1 ? 'h-[400px]' :
                totalCount <= 2 ? 'h-[400px]' : 'h-[800px]';

                return (
                  <div
                    key={i}
                    className={`keen-slider__slide grid w-full gap-4 lg:gap-8 ${gridClass} ${heightClass}`}
                  >
                    {group.map((article: any, j: number) => (
                      <div
                        key={j}
                        className={
                          totalCount === 1
                            ? 'col-start-1 col-end-2 w-1/2 mx-auto'
                            : totalCount === 3 && j === 2
                            ? 'col-start-1 col-end-3 w-1/2 mx-auto'
                            : ''
                        }
                      >
                        <BlogCard
                          {...toCardProps(article)}
                          onLoad={handleImageLoad}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

        </div>
          {sliderReady && slidesData.length > 1 && (
            <>
              <Arrow direction="left" disabled={false} onClick={() => instanceRef.current?.prev()} />
              <Arrow direction="right" disabled={false} onClick={() => instanceRef.current?.next()} />
            </>
          )}
        </div>

        {/* ── MOBILE ── */}
        <div id="blogList" className="grid grid-cols-1 gap-4 lg:hidden">
          {visibleMobileItems.map((article: any, index: number) => (
            <div key={index} className="min-h-[250px] sm:min-h-[300px]">
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