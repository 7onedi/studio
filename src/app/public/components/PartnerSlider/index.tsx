"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";

export const donorsAndPartners = [
  {
    title: "co-founded by the european union",
    image: "/partners/Co-f_EU.png",
    link: "https://youth.europa.eu/",
  },
  {
    title: "co-founded by the european union",
    image: "/partners/Co-f_EU.png",
    link: "https://youth.europa.eu/",
  },
  {
    title: "co-founded by the european union",
    image: "/partners/Co-f_EU.png",
    link: "https://youth.europa.eu/",
  },
] as const;

export default function AutoPartnerSlider() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    drag: false, // прибираємо ручне перетягування
  });

  // Автопрокрутка кожні 5 секунд
  React.useEffect(() => {
    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div className="w-[342px] lg:w-[516px] overflow-hidden">
      <div ref={sliderRef} className="keen-slider flex gap-4">
        {donorsAndPartners.map((partner, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex-none w-[342px] lg:w-[516px] h-[72px] lg:h-[108px] flex justify-center items-center"
          >
            <Link href={partner.link} target="_blank">
              <Image
                src={partner.image}
                alt={partner.title}
                width={516}
                height={108}
                className="object-contain"
                priority
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
