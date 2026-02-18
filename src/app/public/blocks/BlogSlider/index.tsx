"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";

import { groupArticles } from "./data";
import { slides as defaultSlides } from "../ArticleSlider/slideContent";
import { BlogCard } from "./BlogCard";

// якщо в тебе є тип Article — імпортуй його звідки треба
// import type { Article } from "../ArticleSlider/slideContent";

interface ArrowProps {
  onClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => void;
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

type BlogSliderProps = {
  slides?: readonly any[]; // ← заміни any на Article якщо тип є
};

export default function BlogSlider({ slides }: BlogSliderProps) {
  const maxDesktopArticles = 12;
  const maxMobileArticles = 4;

  const sourceSlides = useMemo(
    () => (slides === undefined ? defaultSlides : slides),
    [slides]
  );

  const allArticles = useMemo(
    () => sourceSlides.filter((a: any) => a.meta.placement?.includes("list")),
    [sourceSlides]
  );

  const desktopArticles = useMemo(
    () => allArticles.slice(0, maxDesktopArticles),
    [allArticles]
  );

  // ✅ мобайл тепер бере весь список, а кількість показу керується visibleCount
  const mobileArticles = useMemo(() => allArticles, [allArticles]);

  const slidesData = useMemo(
    () => groupArticles(desktopArticles, 4),
    [desktopArticles]
  );

  const totalArticlesToLoad = desktopArticles.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const loadedCount = useRef(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1, spacing: 0 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  useEffect(() => setIsClient(true), []);

  // ✅ якщо змінився список статей — скидаємо лічильник і loaded
  useEffect(() => {
    loadedCount.current = 0;
    setLoaded(false);
    instanceRef.current?.update();
  }, [allArticles, instanceRef]);

  const handleImageLoad = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalArticlesToLoad) setLoaded(true);
  };

  // ✅ "спадаючий список" для мобайлу (по прикладу)
  const [visibleCount, setVisibleCount] = useState(maxMobileArticles);

  useEffect(() => {
    // якщо прийшов інший список — повертаємось до стартового ліміту
    setVisibleCount(maxMobileArticles);
  }, [allArticles, maxMobileArticles]);

  const visibleItems = useMemo(
    () => mobileArticles.slice(0, visibleCount),
    [mobileArticles, visibleCount]
  );

  const canToggle = mobileArticles.length >= maxMobileArticles * 2;
  const isAllVisible = visibleCount >= mobileArticles.length;

  if (!isClient) return null;

  const isReady = loaded || slidesData.length === 0;

  return allArticles.length ? (
    <div className="mx-auto w-full">
      <div className="relative">
        {/* DESKTOP */}
        <div className="relative hidden lg:block">
          <div
            ref={sliderRef}
            className={`
              keen-slider w-full h-[600px] sm:h-[800px] lg:h-[800px]
              ${!isReady ? "opacity-0" : "opacity-100 transition-opacity duration-500"}
            `}
          >
            {slidesData.map((articleGroup: any[], i: number) => (
              <div
                key={i}
                className="keen-slider__slide grid h-full w-full grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8"
              >
                {articleGroup.map((s: any, j: number) => (
                  <BlogCard key={j} {...s} onLoad={handleImageLoad} />
                ))}
              </div>
            ))}
          </div>

          {isReady && instanceRef.current && slidesData.length > 1 && (
            <>
              <Arrow
                onClick={() => instanceRef.current?.prev()}
                disabled={false}
                direction="left"
              />
              <Arrow
                onClick={() => instanceRef.current?.next()}
                disabled={false}
                direction="right"
              />
            </>
          )}
        </div>

        {/* MOBILE */}
        <div id="blogList" className="grid grid-cols-1 gap-4 lg:hidden">
          {visibleItems.map((article: any, index: number) => (
            <div key={index} className="h-[250px] sm:h-[300px]">
              <BlogCard {...article} onLoad={handleImageLoad} />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Замінили Link на "спадаючий список" */}
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
                  Math.min(prev + maxMobileArticles, mobileArticles.length)
                );
              }
            }}
          >
            {isAllVisible ? "Згорнути" : "ДИВИТИСЬ ЩЕ"}
            <div className="ml-2 flex items-center justify-center">
              <SvgIcon name={isAllVisible ? "up" : "down"} size={24} color="white" />
            </div>
          </Button>
        </div>
      )}
    </div>
  ) : null;
}
