"use client";

import Image from "next/image";
import { methodologyData } from "./Methodology.data";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getMethodologyData } from "@/locales/methodology";

import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import ClientBg from "@/app/public/providers/ClientBg";

function PageImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center mb-12">
      <Image
        src={src}
        alt={alt}
        width={1088}
        height={700}
        className="w-full md:max-w-[70%] h-auto rounded-2xl object-cover"
      />
    </div>
  );
}

export default function MethodologyPage() {
  const { locale } = useLanguage();
  const data = getMethodologyData(locale);

  const { title, description, toplist, topic, imageUrl_1, imageUrl_2, bottomText } = data;

  return (
    <>
      <ClientBg bg="alt" />
      <section className="max-w-auto py-8">

        {/* Title */}
        <h1 className="mb-6 text-headline_1_mobile lg:text-headline_1 font-semibold text-main-text md:text-4xl text-center">
          {title}
        </h1>

        {/* Description */}
        <div className="mb-10 space-y-4 text-base leading-relaxed text-main-text/80">
          {renderRichText(description as RichTextItem[])}
        </div>

        {/* Image 1 — після description */}
        <PageImage src={imageUrl_1} alt={title} />

        {/* Topic */}
        <h2 className="mb-6 text-2xl font-semibold text-main-text">
          {topic}
        </h2>

        {/* Top list */}
        <div className="mb-12 space-y-4 text-base leading-relaxed text-main-text/80">
          {renderRichText(toplist as RichTextItem[])}
        </div>

        {/* Image 2 — після toplist */}
        <PageImage src={imageUrl_2} alt={title} />

        {/* Bottom text */}
        <div className="border-t border-main-grey/30 pt-8 text-base leading-relaxed text-main-text/80">
          {renderRichText(bottomText as RichTextItem[])}
        </div>

      </section>
    </>
  );
}
