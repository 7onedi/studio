"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { FC } from "react";

// --- ДАНІ ДЛЯ ВІДГУКІВ ---
const reviews = [
  {
    name: "Василь Остапенко",
    title: "Учасник програми, студент",
    text: "Участь у цій громадській організації стала для мене справжнім поштовхом до розвитку. Я отримав не лише нові знання й практичні навички, а й відчув, що моя робота справді має значення. Ми реалізували кілька важливих проектів, познайомилися з однодумцями й мали можливість працювати з досвідченими менторами. Це був цінний досвід, який я точно понесу з собою далі.",
    profileImg: "/review/profile.jpg",
  },
  {
    name: "Марія Ковальчук",
    title: "Волонтер, дизайнер",
    text: "Робота в команді над культурними проектами відкрила для мене багато нового. Я змогла застосувати свої навички дизайну для створення візуальної айдентики фестивалю, що було неймовірно цікаво і відповідально. Атмосфера тут дуже надихаюча, а люди — справжні професіонали своєї справи.",
    profileImg: "", // <-- ТУТ ПОРОЖНІЙ РЯДОК
  },
  {
    name: "Олександр Іванов",
    title: "Ментор, режисер",
    text: "Я радий, що мав змогу ділитися своїм досвідом з молодими кіномитцями. Ця організація створює унікальний місток між досвідом та новим поколінням. Енергія та свіжий погляд молоді дійсно вражають, і я впевнений, що багато з них незабаром стануть відомими митцями.",
    profileImg: "", // <-- ТУТ ПОРОЖНІЙ РЯДОК
  },
];

// --- КОМПОНЕНТ ЗАГЛУШКИ ЗОБРАЖЕННЯ (Спрощена версія) ---
interface ImageProps {
    src: string;
    alt: string; // Використовуємо alt для генерації ініціалів
    className?: string;
}
const Image: FC<ImageProps> = (props) => {
    // 1. Перевіряємо, чи є валідний шлях до зображення
    const isSrcMissing = !props.src || props.src.trim() === "";
    
    // 2. Логіка для генерації ініціалів (до двох літер, наприклад: В.О. або М.К.)
    const nameParts = props.alt.split(' ');
    const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : (nameParts[0][0] || 'P').toUpperCase();
    
    // 3. Створення URL для плейсхолдера
    // Використовуємо розмір 300x400, щоб відповідати aspect-[3/4]
    const placeholderUrl = `https://placehold.co/300x400/3B82F6/ffffff?text=${initials}`;

    // Якщо шлях відсутній, одразу відображаємо плейсхолдер.
    // Це вирішує проблему з src=""
    if (isSrcMissing) {
         return (
            <img
                src={placeholderUrl} 
                alt={props.alt}
                className={`${props.className} object-cover`}
                // Встановлюємо alt, оскільки це вже фінальне зображення
                aria-label={`Аватар: ${props.alt}`}
            />
        );
    }

    return (
        <img
            src={props.src} 
            alt={props.alt}
            className={`${props.className} object-cover`}
            onError={(e) => {
                // У разі помилки завантаження (404), замінюємо на плейсхолдер з ініціалами
                (e.target as HTMLImageElement).src = placeholderUrl;
            }}
        />
    );
};


// --- КОМПОНЕНТ НАВІГАЦІЙНОЇ СТРІЛКИ ---
interface ArrowProps {
  onClick: () => void;
  direction: "left" | "right";
  className?: string;
}

const Arrow: FC<ArrowProps> = ({ onClick, direction, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      lg:absolute  lg:top-1/2 lg:-translate-y-1/2
      p-6 lg:p-3 bg-main-blue/50 rounded-full
      transition-all duration-300
      hover:bg-main-blue shadow-lg
      text-white
      z-30
      cursor-pointer
      ${direction === "left" ? "left-0" : "right-0"}
      ${className}
    `}
    aria-label={direction === "left" ? "Попередній відгук" : "Наступний відгуг"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
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


// --- ГОЛОВНИЙ КОМПОНЕНТ ВІДГУКІВ ---
export default function ReviewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reviewsCount = reviews.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % reviewsCount);
  }, [reviewsCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + reviewsCount) % reviewsCount);
  }, [reviewsCount]);

  // Визначаємо індекси сусідніх слайдів для міні-карток
  const prevSlideIndex = (currentSlide - 1 + reviewsCount) % reviewsCount;
  const nextSlideIndex = (currentSlide + 1) % reviewsCount;
  const currentReview = reviews[currentSlide];

  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 300);
      return () => clearTimeout(timer);
  }, [currentSlide]);


  if (!currentReview) return null; // Запобігання помилкам, якщо немає відгуків

  return (
    <div className="lg:text-main-text py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-headline_2_mobile lg:text-headline_2 font-bold mb-10 text-center uppercase" style={{ color: '#E30613' }}>
            Відгуки
        </h2>
        
        <div className="relative mx-auto max-w-5xl"> 
          
          {/* Основний Слайд */}
          <div 
            className={`
                flex flex-col md:flex-row items-center md:items-start p-6 rounded-xl 
                transition-opacity duration-300
                ${transitioning ? "opacity-0" : "opacity-100"}
            `}
          >
            {/* 1. Блок профілю */}
            <div className="flex flex-col items-center h-[250px] lg:h-auto w-full lg:w-auto lg:min-w-[300px] mb-8 md:mb-0 md:mr-10">
                <div className="relative w-full h-auto max-w-[300px] rounded-xl overflow-hidden shadow-2xl aspect-[3/4]">
                    <Image
                        src={currentReview.profileImg}
                        alt={currentReview.name}
                        className="w-full h-full"
                    />
                </div>
                <div className="lg:hidden mt-4 text-center">
                  <h3 className="text-xl font-semibold">{currentReview.name}</h3>
                  <p className="text-gray-400 text-sm">{currentReview.title}</p>
                </div>
            </div>

            {/* 2. Блок тексту відгуку */}
            <div className="flex flex-col justify-center max-w-3xl">
                <p className="lg:text-body leading-relaxed italic mb-6">
                    {currentReview.text}
                </p>
                {/* Декоративна лінія */}
                <div className="hidden lg:block">
                  <div className="w-20 h-1 mb-2" style={{ backgroundColor: '#E30613' }}></div>
                  <h3 className="text-xl font-bold" style={{ color: '#4D90FE' }}>{currentReview.name}</h3>
                  <p className="text-gray-400 text-sm">{currentReview.title}</p>
                </div>
            </div>
          </div>

          
          
          {/* Міні-картки по боках (працюють з новим currentSlide) */}
          {reviewsCount > 1 && (
            <>
                {/* Міні-картка зліва (Попередній) */}
                <div 
                    className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full pr-16 w-32 h-32 cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    onClick={prevSlide}
                    aria-label={`Перейти до попереднього відгуку: ${reviews[prevSlideIndex].name}`}
                >
                    <div className="w-20 h-20 rounded-[10px] overflow-hidden mx-auto border-1 border-gray-700">
                        <Image
                            src={reviews[prevSlideIndex].profileImg}
                            alt={reviews[prevSlideIndex].name}
                            className="w-full h-full"
                        />
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">{reviews[prevSlideIndex].name}</p>
                </div>
                
                {/* Міні-картка справа (Наступний) */}
                <div 
                    className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 translate-x-full pl-16 w-32 h-32 cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    onClick={nextSlide}
                    aria-label={`Перейти до наступного відгуку: ${reviews[nextSlideIndex].name}`}
                >
                    <div className="w-20 h-20 rounded-[10px] overflow-hidden mx-auto border-1 border-gray-700">
                        <Image
                            src={reviews[nextSlideIndex].profileImg}
                            alt={reviews[nextSlideIndex].name}
                            className="w-full h-full"
                        />
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">{reviews[nextSlideIndex].name}</p>
                </div>
            </>
          )}

          {/* НАВІГАЦІЯ (Стрілки) */}
          {reviewsCount > 1 && (
            <div className="flex justify-center">
              <Arrow
                onClick={prevSlide}
                direction="left"
                className="left-0 -translate-x-1/2 md:-translate-x-[250px]"
              />
              <Arrow
                onClick={nextSlide}
                direction="right"
                className="right-0 translate-x-1/2 md:translate-x-[250px]"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}