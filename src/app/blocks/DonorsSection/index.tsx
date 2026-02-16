import Image from "next/image";
import { donorsData } from "./Donors.data";

import type { RichTextItem } from "@components/RenderRichText";
import { renderRichText } from "@components/RenderRichText";

export default function DonorsSection() {
  return (
    <section className="lg:space-y-14 ">
      {donorsData.map((item, index) => {
        const isReverse = index % 2 === 1;

        return (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center gap-3 owerflow-hidden"
            >
              {/* Image */}
              <div
                  className={`col-span-12 lg:col-span-4 mt-4 ${
                  isReverse ? "lg:order-2" : "lg:order-1"
                  }`}
              >
                  <div className="flex rounded-2xl bg-transparent">
                  <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={516}
                      height={108}
                  />
                  </div>
              </div>

              <div
                  className={`col-span-12 lg:col-span-8 text-base leading-relaxed text-main-text ${
                  isReverse ? "lg:order-1" : "lg:order-2"
                  }`}
              >
                <h4 className="my-2 lg:my-0 text-headline_4_mobile lg:text-headline_4">{item.title}</h4>
                <span className="text-body_mobile lg:text-body">
                  {renderRichText(item.description as RichTextItem[])}
                </span>
              </div>
            </div>

        );
      })}
    </section>
  );
}
