"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import { slides } from "./slideContent";

const iconNames = [
  {
    title: "facebook",
    link: "https://www.facebook.com/icyst"
  },
  {
    title: "instagram",
    link: "https://www.instagram.com/intercultural.youth.studio/"
  }, 
  {
    title: "tiktok",
    link: "https://www.tiktok.com/@pangeya.ultima"
  }, 
  {
    title: "youtube",
    link: "https://www.youtube.com/channel/UC7gRBZfWzpQiPE6a7fliZow"
  },
  {
    title: "pangeya",
    link: "https://pangeya.org.ua/"
  },
];

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

  useEffect(() => {
    const totalSlides = slides.length;
    loadedCount.current = 0;

    const handleLoad = () => {
      loadedCount.current += 1;
      if (loadedCount.current === totalSlides) {
        setImagesLoaded(true);
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      {/* SLIDER */}
      <div
        ref={sliderRef}
        className={`keen-slider w-full h-[700px] ${!imagesLoaded ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
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
              priority={i === 0}
            />

            {/* Gradient overlay */}
            {s.gradient && (
              <div className={`absolute inset-0 ${s.gradientMob} lg:${s.gradient}`} />
            )}

            <div className="absolute inset-0 flex flex-col justify-between p-8 lg:mx-16 lg:my-10 lg:p-16">
              <Link href={s.link} className="absolute bottom-8 left-16">
                <div className={`text-white text-headline_1_mobile lg:text-${s.textStyle} max-w-[600px]`}>
                  {s.text}
                </div>
              </Link>
              {/* SOCIAL ICONS */}
              <div className="hidden lg:flex lg:absolute bottom-0 right-16 flex gap-4 z-20">
                {iconNames.map((iconName, i) => (
                  <Button
                    key={i}
                    variant="accent-alt"
                    iconOnly
                    className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-shadow"
                  >
                    <Link href={iconName.link} className="flex item-center">
                      <SvgIcon
                        name={iconName.title}
                        size={24}
                        color="main-blue"
                      />
                    </Link>
                  </Button>
                ))}
              </div>

              {/* DOTS */}
              <div className="hidden lg:absolute bottom-0 left-20 flex items-center gap-3 z-30">
                {slides.map((_, i) => {
                  const active = currentSlide === i;
                  return (
                    <button
                      key={i}
                      onClick={() => instanceRef.current?.moveToIdx(i)}
                      className={`
                        transition-all duration-300
                        ${active
                          ? "w-8 h-4 bg-white rounded-full"
                          : "w-4 h-4 bg-white/40 rounded-full"
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
