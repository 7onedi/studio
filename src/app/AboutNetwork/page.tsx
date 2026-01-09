import Image from "next/image";
import { partnersData } from "./Partners.data";
import DonorsSection from "@blocks/DonorsSection";

import JoinForm from "@blocks/JoinForm";

export default function PartnersPage() {
  const total = partnersData.partnersCards.length
  const lastElement = partnersData.partnersCards[total - 1];

  return (
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
      <section className="lg:mt-8 grid grid-cols-1 lg:grid-cols-12">
        {partnersData.partnersCards.map((partner, i) => {
          const remainder = total % 4;
          const isLastRowFirstItem = remainder !== 0 && i === total - remainder;

          let colStartClass = "";

          if (isLastRowFirstItem) {
            if (remainder === 1  ) colStartClass = "lg:col-start-0 ";
            if (remainder === 2  ) colStartClass = "lg:col-start-4 ";
            if (remainder === 3  ) colStartClass = "lg:col-start-0";
          }

          return (
            <div
              key={partner.id}
              className={`col-span-12 lg:col-span-3 ${colStartClass}
                flex flex-col items-center justify-center rounded-2xl text-center`
              }
            >
              <div className="relative w-full h-[114px] lg:h-[167px]">
                <Image
                  src={partner.image.src}
                  alt={partner.image.alt}
                  fill
                  className="object-contain" 
                />
              </div>
                <div className="mt-0 mb-12 lg:mt-4 lg:mb-0">
                  <p className="text-headline_4_mobile lg:text-headline_4">{partner.title}</p>
                  <p className="pt-4 text-body_mobile lg:text-body">{partner.description}</p>
                </div>
            </div>
          );
        })}
        <div className="lg:my-12 col-span-12 lg:col-start-4 lg:col-span-6">
          <JoinForm />         
        </div>
      </section>
    </main>
  );
}
