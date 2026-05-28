"use client";

import Image from "next/image";
import { useState } from "react";

export function MfkHero({ imageUrl, logoUrl, title }: { imageUrl: string; logoUrl?: string; title: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <>
      <div className="relative w-full h-[145px] lg:h-[700px] mb-6 rounded-[20px] overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {logoUrl && (
        <div className="flex justify-center w-full lg:w-[376px] h-auto rounded-[20px] overflow-hidden">
          {!logoLoaded && <div className="absolute w-full lg:w-[376px] h-[65px] lg:h-[100px] bg-gray-200 animate-pulse rounded-[20px]" />}
          <img
            src={logoUrl}
            alt="MFK logo"
            className="w-auto h-[65px] lg:w-[376px] lg:h-auto object-cover rounded-[20px]"
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
      )}
    </>
  );
}