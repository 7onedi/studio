"use client";

import React, { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { SvgIcon } from "@/app/components/SvgIcon";

import { allArticles, groupArticles } from "./data";
import { BlogCard } from "./BlogCard";

// --- Навігаційна стрілка ---
interface ArrowProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
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
      <SvgIcon
        name={direction}      // "left" або "right"
        size={24}
        color={direction === "left" ? "main-blue" : "main-blue"} // можна задати різні кольори
      />
</button>

);

export default function BlogSlider() {
  const slidesData = groupArticles(allArticles, 4);
  const totalArticles = allArticles.length;

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

  const handleImageLoad = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalArticles) setLoaded(true);
  };

  if (!isClient) return null;

  const isReady = loaded || slidesData.length === 0;

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-0 lg:my-10 py-10 lg:py-16">
      <div className="relative">
        <div
          ref={sliderRef}
          className={`keen-slider w-full h-[600px] sm:h-[800px] lg:h-[800px] ${!isReady ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
        >
          {slidesData.map((articleGroup, i) => (
            <div key={i} className="keen-slider__slide w-full h-full grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
              {articleGroup.map((s, j) => (
                <BlogCard key={j} {...s} onLoad={handleImageLoad} />
              ))}
            </div>
          ))}
        </div>

        {isReady && instanceRef.current && (
          <>
            <Arrow onClick={() => instanceRef.current?.prev()} disabled={false} direction="left" />
            <Arrow onClick={() => instanceRef.current?.next()} disabled={false} direction="right" />
          </>
        )}
      </div>
    </div>
  );
}
