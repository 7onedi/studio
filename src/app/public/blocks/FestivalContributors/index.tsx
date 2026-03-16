"use client";

import Image from "next/image";
import ReviewCard from "./ReviewCard";

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

interface Review {
  name: string;
  title: string;
  text: string;
  profileImg: string;
  links?: SocialLinks;
}


const ROW_PATTERN = [4, 3];

function splitIntoRows<T>(items: T[]) {
  const rows: T[][] = [];
  let index = 0;
  let patternIndex = 0;

  while (index < items.length) {
    const count = ROW_PATTERN[patternIndex % ROW_PATTERN.length];
    rows.push(items.slice(index, index + count));
    index += count;
    patternIndex++;
  }

  return rows;
}

export default function ReviewsBrick( { reviews }: { reviews: Review[] }) {
  const rows = splitIntoRows(reviews);

  return (
    <section className="flex flex-col lg:gap-4">
      {rows.map((row, rowIndex) => {
        const isThree = row.length === 3;

        return (
          <div
            key={rowIndex}
            className="
              lg:mb-16 flex flex-col items-center gap-6
              lg:grid lg:gap-10 lg:justify-center
            "
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 280px))`,
              paddingInline: isThree ? "140px" : undefined,
            }}
          >
            {row.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        );
      })}
    </section>
  );
}
