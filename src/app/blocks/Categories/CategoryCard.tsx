"use client";

import Image from "next/image";

export default function CategoryCard({
  id,
  title,
  image,
  pattern,
  gradient,
  hoverGradient,
}: {
  id: number;
  title: string;
  image: string;
  pattern: string;
  gradient: string;
  hoverGradient: string;
}) {
  const clipId = `clip-triangle-${id}`;

  // Перевертаємо 2 і 4
  const isReversed = id === 2 || id === 4;

  // Зміщення вниз (підібрати під дизайн)
  const shiftY = isReversed ? "translate-y-[25px]" : "";

  // Трохи підсунути вліво, щоб грані паралельно збігались
  const shiftX = isReversed ? "translate-x-[-15px]" : "";

  return (
    <div
      className={`
        hover:scale-110 transition-transform duration-300
        group cursor-pointer
        relative 
        w-[345px] h-[388px] 
        md:w-[472px] md:h-[531px]
        ${shiftX} ${shiftY}
      `}
    >
      <svg width="0" height="0">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d="M441.315 212.062C482.228 235.993 482.228 295.007 441.315 318.938L93.4812 522.4C52.0939 546.609 0 516.83 0 468.962L0 62.0383C0 14.1702 52.094 -15.6093 93.4813 8.59975L441.315 212.062Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className={`
          w-full h-full relative overflow-hidden group cursor-pointer 
          transition-transform duration-300
          ${isReversed ? "rotate-180 origin-center" : ""}
        `}
        style={{ clipPath: `url(#${clipId})` }}
      >
        <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-[1.05]">
          <Image src={image} alt={title} fill className={`object-cover absolute z-10 ${isReversed ? "rotate-180 origin-center" : ""}`} />

          <div className={`absolute inset-0 z-20 pointer-events-none bg-gradient-to-br ${gradient}`} />

          <Image
            src={pattern}
            alt="pattern"
            fill
            className={`
              object-cover absolute pointer-events-none
              z-30 transition-all duration-300 
              group-hover:z-40
              ${isReversed ? "rotate-180 origin-center" : ""}
            `}
          />

          <div
            className={`
              absolute inset-0 pointer-events-none bg-gradient-to-br 
              z-50 transition-all duration-500
              ${gradient} 
              group-hover:${hoverGradient} 
              group-hover:z-20
            `}
          />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <span className="text-white font-bold text-xl md:text-2xl text-center px-4">
          {title}
        </span>
      </div>
    </div>
  );
}
