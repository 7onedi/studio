"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SvgIcon } from "@components/SvgIcon";

interface PopupContent {
  slug?: string;
  title: string;
  description?: string;
  mfkLogo?: string;
}

interface MfkListProps {
  markers: {
    popupContent: PopupContent;
  }[];
}

const ROW_PATTERN = [4, 3, 4, 3, 4];

function splitIntoRows<T>(items: T[]) {
  const rows: T[][] = [];
  let index = 0;

  for (const count of ROW_PATTERN) {
    if (index >= items.length) break;
    rows.push(items.slice(index, index + count));
    index += count;
  }

  return rows;
}

export default function MfkList({ markers }: MfkListProps) {
  const items = markers.map(m => m.popupContent);

  /* ======================
     📱 MOBILE LOGIC
  ====================== */
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount(prev =>
      prev === 4 ? prev + 3 : prev + 4
    );
  };

  const mobileItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  /* ======================
     🖥 DESKTOP LOGIC
  ====================== */
  const rows = splitIntoRows(items);

  const Card = (item: PopupContent) => (
    <div className="relative group">
      <div className="overflow-hidden rounded-t-2xl bg-black border-b-2 border-main-amarant">
        <div className="relative h-[220px] w-full">
          <Image
            src={item.mfkLogo!}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 px-6 py-2 bg-main-amarant text-white text-sm font-semibold rounded-full border-b-2 border-main-amarant">
        {item.title
          .replace("МФК ", "MFK ")
          .split(" – ")[0]
          .toUpperCase()}
      </div>
    </div>
  );

  const isAllVisible = visibleCount >= items.length;

  return (
    <section className="flex flex-col gap-10" id="mfkList">

      {/* ======================
          📱 MOBILE
      ====================== */}

    <div className="flex flex-col gap-8 md:hidden">
      {mobileItems.map((item, index) => (
        <Link key={index} href={`/Mfk/${item.slug}`}>
          {Card(item)}
        </Link>
      ))}

      <button
        onClick={() => {
          if (isAllVisible) {
            setVisibleCount(4);

            const el = document.getElementById("mfkList");
            el?.scrollIntoView({ behavior: "smooth" });
          } else {
            handleLoadMore();
          }
        }}
        className="mx-auto mt-6 px-8 py-3 rounded-full bg-main-amarant text-white font-semibold hover:opacity-90 transition"
      >
      {isAllVisible ? (
          <>
            <div className="flex">
              Згорнути
              <div className="ml-2 flex items-center justify-center">
                <SvgIcon name="up" size={24} color="white" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex">
              Показати ще
              <div className="ml-2 flex items-center justify-center">
                <SvgIcon name="down" size={24} color="white" />
              </div>
            </div>
          </>
        )}
      </button>

    </div>

      {/* ======================
          🖥 DESKTOP
      ====================== */}
      <div className="hidden md:flex flex-col gap-10">
        {rows.map((row, rowIndex) => {
          const isThreeRow = row.length === 3;

          return (
            <div
              key={rowIndex}
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                paddingInline: isThreeRow ? "16.666%" : undefined,
              }}
            >
              {row.map((item, index) => (
                <Link key={index} href={`/Mfk/${item.slug}`}>
                  {Card(item)}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

    </section>
  );
}
