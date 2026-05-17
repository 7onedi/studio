"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import EditorJsViewer from "../../admin/(DashboardLayout)/components/EditorJsViewer";

interface DonorFromApi {
  id: number;
  name: string;
  description?: string | null;
  image?: { id: number; url: string } | null;
  link?: string | null;
}

export default function DonorsSection() {
  const [donors, setDonors] = useState<DonorFromApi[]>([]);

  useEffect(() => {
    fetch("/api/partners/search?role=DONOR&published=true&status=APPROVED&limit=100&page=1")
      .then((r) => r.json())
      .then((d) => setDonors(Array.isArray(d.data) ? d.data : []))
      .catch(console.error);
  }, []);

  if (!donors.length) return null;

  return (
    <section className="lg:space-y-14">
      {donors.map((item, index) => {
        const isReverse = index % 2 === 1;

        return (
          <div key={item.id} className="grid grid-cols-12 items-center gap-3 overflow-hidden">

            {/* Image */}
            <div className={`col-span-12 lg:col-span-4 mt-4 ${isReverse ? "lg:order-2" : "lg:order-1"}`}>
                <div className="flex rounded-2xl bg-transparent">
                {item.image?.url ? (
                    item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <Image
                        src={item.image.url}
                        alt={item.name}
                        width={516}
                        height={108}
                        className="object-contain"
                        />
                    </a>
                    ) : (
                    <Image
                        src={item.image.url}
                        alt={item.name}
                        width={516}
                        height={108}
                        className="object-contain"
                    />
                    )
                ) : (
                    <div className="w-full h-[108px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <span className="text-gray-400 text-sm">{item.name}</span>
                    </div>
                )}
                </div>
            </div>

            {/* Text */}
            <div className={`col-span-12 lg:col-span-8 text-base leading-relaxed text-main-text ${isReverse ? "lg:order-1" : "lg:order-2"}`}>
              <h4 className="my-2 lg:my-0 text-headline_4_mobile lg:text-headline_4">
                {item.name}
              </h4>
              {item.description && (
                <span className="text-body_mobile lg:text-body">
                  {item.description && (() => {
                    try {
                        const parsed = JSON.parse(item.description);
                        if (parsed?.blocks) {
                        return <EditorJsViewer blocks={parsed.blocks} />;
                        }
                    } catch {}
                    return <span>{item.description}</span>;
                  })()}
                </span>
              )}
            </div>

          </div>
        );
      })}
    </section>
  );
}