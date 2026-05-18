"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import EditorJsViewer from "../../admin/(DashboardLayout)/components/EditorJsViewer";

interface PartnerFromApi {
  id: number;
  name: string;
  description?: string | null;
  image?: { id: number; url: string } | null;
  link?: string | null;
}

export default function PartnersSection() {
  const [partners, setPartners] = useState<PartnerFromApi[]>([]);
  const CardWrapper = ({ link, children }: { link?: string | null; children: React.ReactNode }) =>
  link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );

  useEffect(() => {
    fetch("/api/partners/search?role=PARTNER&published=true&status=APPROVED&limit=100&page=1")
      .then((r) => r.json())
      .then((d) => setPartners(Array.isArray(d.data) ? d.data : []))
      .catch(console.error);
  }, []);

  if (!partners.length) return null;

  function hasDescription(raw?: string | null): boolean {
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.blocks?.some((b: any) => b.data?.text?.trim());
    } catch {
      return !!raw.trim();
    }
  }

  return (
    <section className="lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {partners.map((partner) => (
        <div key={partner.id} className="col-span-12 lg:col-span-3">
            <CardWrapper link={partner.link}>
                <div className="group relative flex flex-col justify-between items-center
                                bg-transparent rounded-2xl p-4 min-h-[300px] overflow-hidden">
                    <div className="relative w-full h-[167px] flex-shrink-0 overflow-hidden">
                      {partner.image?.url ? (
                        <Image
                          src={partner.image.url}
                          alt={partner.name}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-[1.15]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                          <span className="text-gray-400 text-sm">{partner.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-1 flex-col justify-center items-center text-center">
                        <p className="text-headline_4_mobile lg:text-headline_4 font-semibold">
                        {partner.name}
                        </p>
                    </div>

                    {partner.description && (
                        <div className="absolute inset-0 bg-white border border-main-amarant/90 flex items-center justify-center
                                        p-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-main-text text-body text-center">
                              {partner.description && (() => {
                                  try {
                                      const parsed = JSON.parse(partner.description);
                                      if (parsed?.blocks) {
                                      return <EditorJsViewer blocks={parsed.blocks} />;
                                      }
                                  } catch {}
                                  return <span>{partner.description}</span>;
                              })()}
                          </p>
                        </div>
                    )}
                    
                </div>
            </CardWrapper>
        </div>
      ))}
    </section>
  );
}