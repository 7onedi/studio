"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";
import Image from "next/image";
import { slides } from "./slideContent";

const iconNames = ["facebook", "instagram", "tiktok", "youtube", "pangeya"];

export default function SliderHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedCount = useRef(0);

const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  slideChanged(s) {
    setCurrentSlide(s.track.details.rel)
  },
});

  // ЮзЕфект для чекання повного завантаження всіх слайдів
  useEffect(() => {
    const totalSlides = slides.length;
    loadedCount.current = 0;

    const handleLoad = () => {
      loadedCount.current += 1;
      if (loadedCount.current === totalSlides) {
        setImagesLoaded(true); // всі зображення завантажені
      }
    };

    // можна обійтися без querySelector, Next.js Image підтримує onLoad
    // але для кожного Image передамо onLoad={handleLoad}
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      {/* SLIDER */}
      <div
        ref={sliderRef}
        className={`keen-slider w-full h-[500px] ${!imagesLoaded ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
      >
        {slides.map((s, i) => (
          <div key={i} className="keen-slider__slide relative">
            <Image
              src={s.img}
              alt=""
              fill
              className="object-cover rounded-3xl"
              onLoad={() => {
                loadedCount.current += 1;
                if (loadedCount.current === slides.length) {
                  setImagesLoaded(true);
                }
              }}
              sizes="100vw"
              priority={i === 0} // пріоритет для першого слайда
            />

            {/* Gradient overlay */}
            {s.gradient && (
              <div className={`absolute inset-0 ${s.gradient}`} />
            )}

            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
              <h2 className="text-white text-headline_2 max-w-[500px]">
                {s.text}
              </h2>

              {/* SOCIAL ICONS */}
              <div className="hidden lg:flex lg:absolute bottom-10 right-10 flex gap-4 z-20">
                {iconNames.map((name, i) => (
                  <Button
                    key={i}
                    variant="accent-alt"
                    iconOnly
                    className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-shadow"
                  >
                    <SvgIcon
                      name={name}
                      size={24}
                      color="main-blue"
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-10 flex items-center gap-3 z-30">
        {slides.map((_, i) => {
          const active = currentSlide === i;
          return (
            <button
              key={i}
              onClick={() => instanceRef.current?.moveToIdx(i)}
              className={`
                transition-all duration-300
                ${active
                  ? "w-5 h-2 bg-white rounded-full"
                  : "w-2 h-2 bg-white/40 rounded-full"
                }`}
            />
          );
        })}
      </div>
    </div>
  );
}
