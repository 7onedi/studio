"use client";

import Image from "next/image";
import { getPartnerData } from "@/locales/partners";
import { useLanguage } from "@/app/providers/LanguageProvider";
import DonorsSection from "@/app/public/blocks/DonorsSection";
import JoinForm from "@/app/public/blocks/JoinForm";
import ClientBg from "@/app/public/providers/ClientBg";

export default function PartnersPage() {
  const { locale } = useLanguage();
  const partnersData = getPartnerData(locale);

  const total = partnersData.partnersCards.length
  const lastElement = partnersData.partnersCards[total - 1];

  return (
    <>
      <ClientBg bg="alt" />
      <main className="lg:mt-16 bg-transparent">
        <h1 className="my-6 text-headline_1_mobile lg:text-headline_1 font-semibold text-main-text md:text-4xl text-center">
          {partnersData.topic}
        </h1>
        <h2 className="lg:mt-20 mb-4 text-center text-headline_2_mobile lg:text-headline_3">
          {partnersData.subtitle1}
        </h2>

        <DonorsSection />

        <h2 className="mt-8 lg:mt-24 text-center text-headline_3_mobile lg:text-headline_3">
          {partnersData.subtitle2}
        </h2>
          <section className="lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {partnersData.partnersCards.map((partner) => {
              return (
                <div
                  key={partner.id}
                  className="col-span-12 lg:col-span-3 flex flex-col justify-between items-center
                            bg-transparent rounded-2xl p-4 min-h-[300px]"
                >
                  {/* Картинка */}
                  <div className="relative w-full h-[167px] flex-shrink-0">
                    <Image
                      src={partner.image.src}
                      alt={partner.image.alt}
                      fill
                      className="object-contain"
                    />
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0"
                    />
                  </div>

                  {/* Текст */}
                  <div className="mt-4 flex flex-1 flex-col justify-center items-center text-center">
                    <p className="text-headline_4_mobile lg:text-headline_4 font-semibold">
                      {partner.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
      </main>
    </>
  );
}
