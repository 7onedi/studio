"use client";

import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";

interface DonorFromApi {
  id: number;
  name: string;
  image?: { id: number; url: string } | null;
  link?: string | null;
}

export default function AutoPartnerSlider() {
  const [donors, setDonors] = useState<DonorFromApi[]>([]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    drag: true,
  });

  useEffect(() => {
    fetch("/api/partners/search?role=DONOR&published=true&status=APPROVED&limit=100&page=1")
      .then((r) => r.json())
      .then((d) => setDonors(Array.isArray(d.data) ? d.data : []))
      .catch(console.error);
  }, []);

  if (!donors.length) return null;

  return (
    <div className="w-[342px] lg:w-[516px] overflow-hidden">
      <div ref={sliderRef} className="keen-slider flex gap-4">
        {donors.map((donor) => (
          <div
            key={donor.id}
            className="keen-slider__slide flex-none w-[342px] lg:w-[516px] h-[72px] lg:h-[108px] flex justify-center items-center"
          >
            {donor.image?.url && (
              donor.link ? (
                <Link href={donor.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={donor.image.url}
                    alt={donor.name}
                    width={516}
                    height={108}
                    className="object-contain"
                    priority
                  />
                </Link>
              ) : (
                <Image
                  src={donor.image.url}
                  alt={donor.name}
                  width={516}
                  height={108}
                  className="object-contain"
                  priority
                />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}