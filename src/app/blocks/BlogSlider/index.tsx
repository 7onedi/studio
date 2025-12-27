"use client";

import React, { useState, useEffect, useRef, useMemo } from "react"; // 💡 Додано useMemo
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import { SvgIcon } from "@/app/components/SvgIcon";

// Припускаємо, що ці імпорти тепер працюють і включають BlogCard:
import { allArticles, groupArticles } from "./data"; 
import { BlogCard } from "./BlogCard";

// --- Навігаційна стрілка (Червона) ---
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
  
  // 1. ОБМЕЖЕННЯ ДАНИХ
  const maxDesktopArticles = 12;
  const maxMobileArticles = 4;
    
  // Обмеження для десктопного слайдера (максимум 12 статей)
  const desktopArticles = useMemo(() => 
    allArticles.slice(0, maxDesktopArticles)
  , []);
  
  // Обмеження для мобільного списку (максимум 4 статті)
  const mobileArticles = useMemo(() => 
    allArticles.slice(0, maxMobileArticles)
  , []);
    
  // Групуємо дані для слайдера (по 4)
  const slidesData = groupArticles(desktopArticles, 4); 
  const totalArticlesToLoad = desktopArticles.length; // Використовуємо 12 для лічильника завантаження
    
  // --- ЛОГІКА СЛАЙДЕРА ТА ЗАВАНТАЖЕННЯ ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const loadedCount = useRef(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    // loop: desktopArticles.length > 4, // 💡 Можна відключити loop, якщо карток менше 4
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
    // Використовуємо обмежену кількість
    if (loadedCount.current >= totalArticlesToLoad) setLoaded(true); 
  };

  if (!isClient) return null;

  const isReady = loaded || slidesData.length === 0;

  return (
    <div className="mx-auto w-full">
      <div className="relative">

        {/* --- 1. Десктопний слайдер (lg:block, обмежено 12 картками) --- */}
        <div className="hidden lg:block relative">
            <div
                ref={sliderRef}
                className={`
                    keen-slider w-full h-[600px] sm:h-[800px] lg:h-[800px]
                    ${!isReady ? "opacity-0" : "opacity-100 transition-opacity duration-500"}
                `}
            >
                {slidesData.map((articleGroup, i) => (
                    // Слайд групи (4 картки)
                    <div key={i} className="keen-slider__slide w-full h-full grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        {articleGroup.map((s, j) => (
                            <BlogCard key={j} {...s} onLoad={handleImageLoad} />
                        ))}
                    </div>
                ))}
            </div>

            {isReady && instanceRef.current && (
                <>
                    {/* Показуємо стрілки, тільки якщо є більше ніж 1 слайд */}
                    {slidesData.length > 1 && (
                      <>
                        <Arrow onClick={() => instanceRef.current?.prev()} disabled={false} direction="left" />
                        <Arrow onClick={() => instanceRef.current?.next()} disabled={false} direction="right" />
                      </>
                    )}
                </>
            )}
        </div>


        {/* --- 2. Мобільний список (lg:hidden, обмежено 4 картками) --- */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
            {mobileArticles.map((article, index) => (
                 <div key={index} className="h-[250px] sm:h-[300px]">
                    <BlogCard {...article} onLoad={handleImageLoad} />
                 </div>
            ))}
        </div>

      </div>
      
      <div className="mt-6 flex justify-center lg:hidden">
        <Link href="https://stina.pangeya.org.ua/selo-stina" passHref>
          <Button variant="primary">
            ДИВИТИСЬ ЩЕ
            <div className="ml-2 flex items-center justify-center">
              <SvgIcon name="down" size={24} color="white" />
            </div>
          </Button>
        </Link>
      </div>


    </div>
  );
}