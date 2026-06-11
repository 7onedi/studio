"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const iconNames = [
  { title: "facebook", link: "https://www.facebook.com/icyst" },
  { title: "instagram", link: "https://www.instagram.com/intercultural.youth.studio/" },
  { title: "tiktok", link: "https://www.tiktok.com/@pangeya.ultima" },
  { title: "youtube", link: "https://www.youtube.com/channel/UC7gRBZfWzpQiPE6a7fliZow" },
  { title: "pangeya", link: "https://pangeya.org.ua/" },
];

async function fetchSlider1Articles(): Promise<any[]> {
  const res = await fetch(
    `${BASE_URL}/api/articles/search?limit=100&sortBy=publishedAt&order=desc&published=true`
  );
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  const all = Array.isArray(data?.data) ? data.data : [];
  return all.filter((a: any) => a.slider === "SLIDER_1");
}

function toSlide(article: any) {
  const g = article.gradient;

  const gradient =
    g === "GRADIENT_1"
      ? "lg:bg-gradient-to-r lg:from-main-blue/100 lg:via-main-blue/15 lg:to-transparent"
      : g === "GRADIENT_2"
      ? "lg:bg-gradient-to-r lg:from-main-amarant/100 lg:via-main-amarant/15 lg:to-transparent"
      : "";

  const gradientMob =
    g === "GRADIENT_1"
      ? "bg-gradient-to-r from-main-blue/75 via-main-blue/45 to-transparent"
      : g === "GRADIENT_2"
      ? "bg-gradient-to-r from-main-amarant/75 via-main-amarant/45 to-transparent"
      : "";

  return {
    slug: article.slug ?? "",
    title: article.title ?? "",
    img: article.image?.url ?? null,
    gradient,
    gradientMob,
    textStyle: "",
  };
}

// Skeleton — показується поки дані не завантажились
function SliderSkeleton() {
  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-gray-200 animate-pulse">
      {/* Імітація градієнтного overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300/80 via-gray-200/40 to-transparent" />

      {/* Імітація заголовку */}
      <div className="absolute top-8 left-8 lg:top-16 lg:left-16 space-y-3 max-w-[500px]">
        <div className="h-8 bg-gray-300 rounded-lg w-96" />
        <div className="h-8 bg-gray-300 rounded-lg w-72" />
        <div className="h-8 bg-gray-300 rounded-lg w-80" />
      </div>

      {/* Імітація кнопки */}
      <div className="absolute bottom-8 left-8 lg:left-16 h-12 w-36 bg-gray-300 rounded-full" />

      {/* Імітація dot-навігації */}
      <div className="hidden lg:flex absolute bottom-8 left-20 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full bg-gray-300 ${i === 0 ? "w-8 h-4" : "w-4 h-4"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function SliderHero() {
  const [slides, setSlides] = useState<ReturnType<typeof toSlide>[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ready = перше зображення повністю завантажилось
  const [ready, setReady] = useState(false);
  const firstImageLoadedRef = useRef(false);

const { t, locale } = useLanguage();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    drag: true,
  });

  useEffect(() => {
    fetchSlider1Articles().then((articles) => {
      setSlides(articles.filter((a: any) => a.lang?.toLowerCase() === locale).map(toSlide));
    });
  }, [locale]);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      instanceRef.current?.update();
    }, 100);
    return () => clearTimeout(timer);
  }, [instanceRef]);

  useEffect(() => {
    instanceRef.current?.update();
  }, [slides, instanceRef]);

  useEffect(() => {
    const t = setInterval(() => instanceRef.current?.next(), 10000);
    return () => clearInterval(t);
  }, [instanceRef]);

  // Fallback: якщо зображення нема або onLoad не спрацює — показуємо через 1.5s
  useEffect(() => {
    if (slides.length === 0) return;
    const fallback = setTimeout(() => {
      if (!firstImageLoadedRef.current) {
        setReady(true);
      }
    }, 1500);
    return () => clearTimeout(fallback);
  }, [slides]);

  const handleFirstImageLoad = () => {
    if (!firstImageLoadedRef.current) {
      firstImageLoadedRef.current = true;
      setReady(true);
    }
  };

  // Поки дані ще не прийшли — skeleton
  if (slides.length === 0) return <SliderSkeleton />;

  return (
    <div className="relative w-full overflow-hidden ">
      {/* Skeleton поверх слайдера, зникає після ready */}
      {!ready && (
        <div className="absolute inset-0 z-30">
          <SliderSkeleton />
        </div>
      )}

      {/* Сам слайдер — завжди в DOM, але невидимий до ready */}
      <div
        className={`transition-opacity duration-700 ${
          ready && mounted ? "opacity-100" : "opacity-0"
        }`}
      >
         <div ref={sliderRef} className="keen-slider w-full h-screen">
          {slides.map((s, i) => (
            <div key={s.slug} className="keen-slider__slide relative">
              {s.img && (
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  // Перший слайд — найвищий пріоритет завантаження
                  priority={i === 0}
                  // fetchPriority hint для браузера
                  fetchPriority={i === 0 ? "high" : "low"}
                  onLoad={i === 0 ? handleFirstImageLoad : undefined}
                />
              )}

              {/* Мобільний градієнт */}
              <div className={`absolute inset-0 lg:hidden ${s.gradientMob}`} />

              {/* Десктопний градієнт */}
              <div className={`absolute inset-0 hidden lg:block ${s.gradient}`} />

               <div className="absolute inset-0 flex flex-col justify-between py-8 lg:py-10">
  
                {/* Контент вирівняний по container */}
                <div className="container h-full flex flex-col justify-between items-start lg:items-stretch"> 
                  
                  {/* Заголовок — тільки десктоп, зверху */}
                  <div className={`hidden lg:block mt-36 text-white text-headline_2 ${s.textStyle} max-w-[600px] lg:pt-16 text-left`}>
                    {s.title.length > 128 ? s.title.slice(0, 128) + '…' : s.title}
                  </div>

                  <div className="flex items-end lg:justify-between pb-4 lg:mt-0 mt-auto">
                    <div className="w-full flex flex-col lg:block justify-center">
                      
                      {/* Заголовок — тільки мобільний, над кнопкою */}
                      <div className={`mb-8 lg:hidden text-white text-headline_2_mobile ${s.textStyle} max-w-[600px] text-left`}>
                        {s.title.length > 128 ? s.title.slice(0, 128) + '…' : s.title}
                      </div>

                      <Link href={`/public/Article/${s.slug}`}>
                        <Button variant="secondary-alt">
                          <span className="mr-3">{t("views.article.read_more")}</span>
                          <SvgIcon name="right" size={24} color="white" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                    {/* Dots навігація */}
                    <div className="flex justify-between">
                    <div className="hidden lg:flex items-center gap-3 ">
                      {slides.map((_, idx) => {
                        const active = currentSlide === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`m-1 transition-all duration-300 ${
                              active ? "w-8 h-4 bg-white rounded-full" : "w-4 h-4 bg-white/40 rounded-full"
                            }`}
                          />
                        );
                      })}
                    </div>
                    {/* Іконки соцмереж */}
                    <div className="hidden lg:flex gap-4">
                      {iconNames.map((iconName) => (
                        <Link key={iconName.title} href={iconName.link} className="flex items-center">
                          <Button
                            variant="accent-alt"
                            iconOnly
                            className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                          >
                            <SvgIcon name={iconName.title} size={24} color="main-blue" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                    </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}