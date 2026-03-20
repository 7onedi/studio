"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import Image from "next/image";
import Link from "next/link";

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
  return {
    slug: article.slug ?? "",
    title: article.title ?? "",
    img: article.image?.url ?? null, // ← відносний шлях /uploads/...
    gradient: "",
    gradientMob: "",
    textStyle: "",
  };
}

export default function SliderHero() {
  const [slides, setSlides] = useState<ReturnType<typeof toSlide>[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    drag: true,
  });

  useEffect(() => {
    fetchSlider1Articles().then((articles) => {
      setSlides(articles.map(toSlide));
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      instanceRef.current?.update();
    }, 100);
    return () => clearTimeout(timer);
  }, [instanceRef]);

  // Оновлюємо слайдер після завантаження даних
  useEffect(() => {
    instanceRef.current?.update();
  }, [slides, instanceRef]);

  useEffect(() => {
    const t = setInterval(() => instanceRef.current?.next(), 8000);
    return () => clearInterval(t);
  }, [instanceRef]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div ref={sliderRef} className="keen-slider w-full h-[700px]">
        {slides.map((s, i) => (
          <div key={s.slug} className="keen-slider__slide relative">
            {s.img && (
              <Image
                src={s.img}
                alt={s.title}
                fill
                className="object-cover rounded-3xl"
                sizes="100vw"
                priority={i === 0}
              />
            )}

            <div className={`absolute inset-0 ${s.gradientMob} ${s.gradient}`} />

            <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-0 lg:px-16 lg:pt-16 lg:mx-16 lg:my-10">
              <div className={`text-white text-headline_1_mobile ${s.textStyle} max-w-[600px]`}>
                {s.title}
              </div>
              <Link
                href={`/public/Article/${s.slug}`}
                className="absolute bottom-8 left-16 lg:relative lg:bottom-0 lg:left-0 z-20"
              >
                <Button variant="secondary-alt">
                  <span className="mr-3"> ПЕРЕГЛЯНУТИ </span>
                  <SvgIcon name="right" size={24} color="white" />
                </Button>
              </Link>

              <div className="hidden lg:flex lg:absolute bottom-0 right-16 gap-4 z-20">
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

              <div className="hidden lg:flex bottom-0 left-20 items-center gap-3 z-30">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}