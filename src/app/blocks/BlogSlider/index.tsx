"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import React, { useState, useEffect, useRef } from "react";
// Заглушка для Image. У вашому Next.js проекті слід використовувати 'next/image'
const Image = (props: any) => {
  return (
    <img
      src={props.src}
      alt={props.alt}
      style={{
        position: props.fill ? 'absolute' : 'static',
        width: props.fill ? '100%' : 'auto',
        height: props.fill ? '100%' : 'auto',
        objectFit: props.className?.includes('object-cover') ? 'cover' : 'contain',
        borderRadius: props.className?.includes('rounded-xl') ? '0.75rem' : '0',
        transition: 'transform 0.5s',
      }}
      onLoad={props.onLoad}
      className={props.className}
    />
  );
};


// --- ДАНІ ДЛЯ СЛАЙДЕРА (Розширено до 8 статей для демонстрації 2 слайдів по 4) ---
const allArticles = [
  {
    title: "Мале кіно — велика подія: Вінниця збирає кіномитців з усього світу",
    gradient: "bg-gradient-to-t from-blue-900/80 via-blue-900/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Кінофест"],
  },
  {
    title: "Назва статті може бути в декілька рядків",
    gradient: "bg-gradient-to-t from-red-800/80 via-red-800/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Новини"],
  },
  {
    title: "Як мистецтво впливає на суспільство та культурний розвиток міста",
    gradient: "bg-gradient-to-t from-red-800/80 via-red-800/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Культура"],
  },
  {
    title: "Новий напрямок: Стрічка про відомого режисера",
    gradient: "bg-gradient-to-t from-blue-900/80 via-blue-900/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Прем'єра"],
  },
  // --- П'ЯТА СТАТТЯ (Початок другого слайда) ---
  {
    title: "Світові тренди кіноіндустрії 2024 року",
    gradient: "bg-gradient-to-r from-blue-900/80 via-blue-900/10 to-transparent",
    img: "https://placehold.co/800x600/083344/ffffff?text=Article+5",
    tags: ["#Тренди", "#Кіно"],
  },
  {
    title: "Інтерв'ю з лауреатом премії фестивалю",
    gradient: "bg-gradient-to-r from-red-800/80 via-red-800/10 to-transparent",
    img: "https://placehold.co/800x600/991b1f/ffffff?text=Article+6",
    tags: ["#Лауреати", "#Інтерв'ю"],
  },
  {
    title: "Залаштунки зйомок: як створюється магія кіно",
    gradient: "bg-gradient-to-r from-red-800/80 via-red-800/10 to-transparent",
    img: "https://placehold.co/800x600/991b1f/ffffff?text=Article+7",
    tags: ["#Залаштунки", "#Зйомки"],
  },
  {
    title: "Огляд найкращих короткометражок року",
    gradient: "bg-gradient-to-r from-blue-900/80 via-blue-900/10 to-transparent",
    img: "https://placehold.co/800x600/083344/ffffff?text=Article+8",
    tags: ["#Огляд", "#Короткометражки"],
  },
] as const;

// Функція для групування статей по 4
const groupArticles = (arr: typeof allArticles, size: number) => {
  const grouped: (typeof allArticles[number][])[] = [];
  for (let i = 0; i < arr.length; i += size) {
    grouped.push(arr.slice(i, i + size));
  }
  return grouped;
};

const slidesData = groupArticles(allArticles, 4);
const totalArticles = allArticles.length;


// --- КОМПОНЕНТ КНОПКИ-ХЕШТЕГА ---
const TagButton: React.FC<{ tag: string; className?: string }> = ({ tag, className = "" }) => (
  <button
    className={`
      px-3 py-1 text-xs font-semibold
      bg-white/20 backdrop-blur-sm text-white rounded-full
      transition-colors duration-200 hover:bg-white/30
      shadow-sm
      ${className}
    `}
  >
    {tag}
  </button>
);

// --- КОМПОНЕНТ НАВІГАЦІЙНОЇ СТРІЛКИ ---
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
      p-3 bg-white/70 rounded-full
      transition-all duration-300
      hover:bg-white shadow-md
      z-30
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${direction === "left" ? "left-3 md:left-6" : "right-3 md:right-6"}
    `}
    aria-label={direction === "left" ? "Попередній слайд" : "Наступний слайд"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-gray-700"
    >
      {direction === "left" ? (
        <path
          fillRule="evenodd"
          d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M16.28 12.53a.75.75 0 000-1.06l-7.5-7.5a.75.75 0 00-1.06 1.06L14.69 12l-6.97 6.97a.75.75 0 101.06 1.06l7.5-7.5z"
          clipRule="evenodd"
        />
      )}
    </svg>
  </button>
);

// --- ГОЛОВНИЙ КОМПОНЕНТ СЛАЙДЕРА ---
export default function BlogSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const loadedCount = useRef(0);
  
  // Ініціалізація Keen-Slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "snap",
      // Тепер кожен слайд займає 100% ширини і містить 4 елементи в сітці 2x2
      slides: {
        perView: 1, 
        spacing: 0,
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageLoad = () => {
    loadedCount.current += 1;
    // Чекаємо завантаження всіх статей, а не лише 4
    if (loadedCount.current >= totalArticles) { 
      setLoaded(true); 
    }
  };

  if (!isClient) return null; // Не рендеримо на сервері

  const isReady = loaded || slidesData.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Останні статті</h3>
      <div className="relative">
        {/* SLIDER CONTAINER */}
        <div
          ref={sliderRef}
          // Значно збільшуємо висоту, щоб вмістити 2 ряди по 2 статті
          className={`keen-slider w-full h-[600px] sm:h-[800px] lg:h-[900px] 
            ${!isReady ? "opacity-0" : "opacity-100 transition-opacity duration-500"}
          `}
        >
          {slidesData.map((articleGroup, i) => (
            <div 
                key={i} 
                className="keen-slider__slide w-full h-full 
                           grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8"
            >
              {articleGroup.map((s, j) => (
                // КОНТЕЙНЕР ДЛЯ ОДНІЄЇ СТАТТІ (ОДНА ЧВЕРТЬ СЛАЙДА)
                <div key={j} className="relative rounded-xl overflow-hidden cursor-pointer group h-full">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={handleImageLoad}
                      sizes="(max-width: 768px) 50vw, 25vw" 
                      priority={i === 0 && j === 0} 
                    />

                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/20 ${s.gradient}`} />

                    {/* КОНТЕНТ СТАТТІ */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8">
                        {/* Хештеги вгорі над заголовком */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {s.tags.map((tag, tagIndex) => (
                                <TagButton key={tagIndex} tag={tag} />
                            ))}
                        </div>
                        {/* Заголовок */}
                        <h2 className="text-white text-md sm:text-xl font-bold max-w-full line-clamp-3 leading-tight">
                            {s.title}
                        </h2>
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* НАВІГАЦІЙНІ СТРІЛКИ */}
        {isReady && instanceRef.current && (
          <>
            <Arrow
              onClick={(e) => instanceRef.current?.prev()}
              disabled={false} // Залишаємо завжди активними через loop: true
              direction="left"
            />
            <Arrow
              onClick={(e) => instanceRef.current?.next()}
              disabled={false} // Залишаємо завжди активними через loop: true
              direction="right"
            />
          </>
        )}

      </div>
    </div>
  );
}