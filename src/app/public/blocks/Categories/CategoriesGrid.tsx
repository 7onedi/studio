"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MOBILE_W = 345;
const MOBILE_H = 388;
const DESKTOP_W = 472;
const DESKTOP_H = 531;
const DESKTOP_SCALE = 0.8;

const MOBILE_PATH = "M322.571 155.003C352.476 172.495 352.476 215.63 322.571 233.122L68.3284 381.839C38.0771 399.534 1.40048e-05 377.768 1.55342e-05 342.779L2.85355e-05 45.3458C3.00648e-05 10.3574 38.0772 -11.4094 68.3285 6.28583L322.571 155.003Z";
const DESKTOP_PATH = "M441.315 212.062C482.228 235.993 482.228 295.007 441.315 318.938L93.4812 522.4C52.0939 546.609 0 516.83 0 468.962L0 62.0383C0 14.1702 52.094 -15.6093 93.4813 8.59975L441.315 212.062Z";

interface Category {
  id: number;
  title: string;
  image: string;
  pattern: string;
  gradient: string;
  hoverGradient: string;
  link: string;
}

interface CardProps {
  category: Category;
  x: number;
  y: number;
  W: number;
  H: number;
  path: string;
  isReversed: boolean;
  isDesktop: boolean;
  scale?: number;
  isFirst?: boolean; 
  onImageLoad?: () => void;
  isFourth?: boolean;
}

function SvgCard({ category, x, y, W, H, path, isReversed, isDesktop, scale = 1, isFirst, onImageLoad, isFourth }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const clipId = `clip-card-${category.id}`;
  const imgId  = `img-card-${category.id}`;
  const patId  = `pat-card-${category.id}`;

 const gradColor = category.gradient.includes("amarant")
  ? "#E91651"
  : category.gradient.includes("grass")
  ? "#81b214"
  : category.gradient.includes("purple")
  ? "#7B2FBE"
  : "#1A4D8F";

  const textCX = isReversed ? W * 0.55 : W * 0.45;
  const textCY = H * 0.5;

  const flipTransform = `scale(-1,1) translate(-${W},0)`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g
        transform={`translate(${W * (scale ?? 1) / 2}, ${H * (scale ?? 1) / 2}) scale(${hovered ? 1.1 : 1}) translate(-${W * (scale ?? 1) / 2}, -${H * (scale ?? 1) / 2})`}
        style={{ 
        cursor: "pointer",
        transition: "transform 0.2s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => router.push(category.link)}
      >
      <defs>
        {gradColor === "#81b214" && (
        <linearGradient
          id={`grad-diag-${category.id}`}
          x1={isReversed ? "1" : "0"}
          y1="0"
          x2={isReversed ? "0" : "1"}
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="49%" stopColor="#F5A623" />
          <stop offset="49%" stopColor="#ffffff" />
          <stop offset="51%" stopColor="#ffffff" />
          <stop offset="51%" stopColor="#81b214" />
        </linearGradient>
      )}
        <clipPath id={clipId}>
          <path d={path} transform={isReversed ? flipTransform : undefined} />
        </clipPath>

        <pattern id={imgId} patternUnits="userSpaceOnUse" width={W} height={H}>
          <image
            href={category.image}
            x="0" y="0" width={W} height={H}
            preserveAspectRatio="xMidYMid slice"
            transform={isReversed ? flipTransform : undefined}
            // @ts-ignore
            onLoad={isFirst ? onImageLoad : undefined}
          />
        </pattern>

        <pattern id={patId} patternUnits="userSpaceOnUse" width={W} height={H}>
          <image
            href={category.pattern}
            x="0" y="0" width={W} height={H}
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>

      <g clipPath={`url(#${clipId})`}>

      {/* 1. Фото */}
        <image
          href={category.image}
          x="0" y="0" width={W} height={H}
          preserveAspectRatio="xMidYMid slice"
          transform={isReversed && !isFourth ? flipTransform : undefined}
          // @ts-ignore
          onLoad={isFirst ? onImageLoad : undefined}
        />

        {/* 2. Градієнт */}
        <path
          d={path}
          transform={isReversed ? flipTransform : undefined}
          fill={gradColor}
          opacity={0.6}
        />

        {/* 3. Pattern */}
        <image
          href={category.pattern}
          x="0" y="0" width={W} height={H}
          preserveAspectRatio="xMidYMid slice"
          transform={isReversed && !isFourth ? flipTransform : undefined}
        />

        {/* 4. Верхній градієнт — зникає при наведенні */}
        <path
          d={path}
          transform={isReversed || isFourth ? flipTransform : undefined}
          fill={gradColor === "#81b214" ? `url(#grad-diag-${category.id})` : gradColor}
          style={{ opacity: hovered ? 0 : 0.4, transition: "opacity 0.5s" }}
        />
      </g>

      {/* Текст */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontWeight="bold"
        fontSize={isDesktop ? 28 : 16}
        style={{ pointerEvents: "none", fontFamily: "inherit" }}
      >
        {category.title
          .split(" ")
          .reduce<string[][]>((lines, word) => {
            const last = lines[lines.length - 1];
            if (!last || last.join(" ").length + word.length > 12) lines.push([word]);
            else last.push(word);
            return lines;
          }, [])
          .map((line, i, arr) => (
            <tspan
              key={i}
              x={textCX}
              y={i === 0 ? textCY : undefined}
              dy={i === 0 ? `${-(arr.length - 1) * 0.65}em` : "1.3em"}
            >
              {line.join(" ")}
            </tspan>
          ))}
      </text>
      </g>
    </g>
  );
}

export default function CategoriesGrid({
  categories,
  onImageLoad,
}: {
  categories: Category[];
  onImageLoad?: () => void;
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Поки не знаємо — показуємо skeleton замість неправильного layout
  if (isDesktop === null) {
    return (
      <div className="w-full animate-pulse">
        <div className="hidden md:block h-[450px] bg-gray-200 rounded-2xl" />
        <div className="md:hidden h-[1400px] bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (isDesktop) {
    const BW = DESKTOP_W;          // base path width  = 472
    const BH = DESKTOP_H;          // base path height = 531
    const S  = DESKTOP_SCALE;      // 1.25
    const W  = BW * S;             // реальна ширина карточки = 590
    const H  = BH * S;             // реальна висота карточки = 663.75

    // Вістря трикутника знаходиться на правому краю (x ≈ W після scale)
    // Карточки 1→ і ←2 утворюють пару: вістря 1 торкається вістря 2
    // Зміщення по Y: 2 і 4 опущені на shiftY щоб центри пар були на одному рівні

    const shiftY  = H * 0.38;   // вертикальне зміщення нижніх карточок
    const pairGap = 30;   // було W*0.08 = ~47
    const tipGap  = 5;    // мінімальний зазор між вістрями всередині пари

    // Пара ліво: 1(→) і 2(←)
    // 1 починається з x=0, її вістря на x=W
    // 2 reversed — її вістря зліва (x=0 власного простору), тобто ставимо x = W + tipGap
    const p1x = 0;
    const p2x = W + tipGap;

    // Пара право: 3(→) і 4(←)
    // Ліва пара займає від 0 до p2x+W = W*2 + tipGap
    const p3x = p2x + W + pairGap;
    const p4x = p3x + W + tipGap;

    const totalW = p4x + W;
    const totalH = H + shiftY;

    const positions = [
      { x: p1x, y: 0,       reversed: false }, // 1 → зверху
      { x: p2x - 100, y: shiftY + 60,  reversed: true  }, // 2 ← знизу
      { x: p3x, y: 0,       reversed: false }, // 3 → зверху
      { x: p4x - 100, y: shiftY + 60,  reversed: true  }, // 4 ← знизу
    ];

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{ 
            display: "block", 
            overflow: "visible",
            minHeight: `${totalH * 0.8}px`, // не дає стискатись нижче
        }}
      >
        {categories.map((cat, i) => (
          <SvgCard
            key={cat.id}
            category={cat}
            x={positions[i].x}
            y={positions[i].y}
            W={BW}
            H={BH}
            path={DESKTOP_PATH}
            isReversed={positions[i].reversed}
            isDesktop={true}
            scale={S}
            isFirst={i === 0}
            isFourth={i === 3}
            onImageLoad={onImageLoad}
          />
        ))}
      </svg>
    );
  }

  // Мобільний — не чіпаємо
  const W     = MOBILE_W;
  const H     = MOBILE_H;
  const stepY = H * 0.82;
  const totalH = stepY * 3 + H;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${totalH}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {categories.map((cat, i) => (
        <SvgCard
          key={cat.id}
          category={cat}
          x={0}
          y={i * stepY}
          W={W}
          H={H}
          path={MOBILE_PATH}
          isReversed={i % 2 === 1}
          isDesktop={false}
          isFirst={i === 0}
          isFourth={i === 3}
          onImageLoad={onImageLoad}
        />
      ))}
    </svg>
  );
}