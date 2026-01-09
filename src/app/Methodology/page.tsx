import Image from "next/image";
import { methodologyData } from "./Methodology.data";

import type { RichTextItem } from "@components/RenderRichText";
import { renderRichText } from "@components/RenderRichText";

export default function MethodologyPage() {
  const {
    title,
    description,
    topic,
    toplist,
    imageUrl,
    bottomText,
  } = methodologyData;

  return (
    <section className=" max-auto py-8">
      {/* Title */}
      <h1 className="mb-6 text-headline_1_mobile lg:text-headline_1 font-semibold text-main-text md:text-4xl text-center">
        {title}
      </h1>

      {/* Description */}
      <div className="mb-10 space-y-4 text-base leading-relaxed text-main-text/80">
        {renderRichText(description as RichTextItem[])}
      </div>

      {/* Topic */}
      <h2 className="mb-6 text-2xl font-semibold text-main-text">
        {topic}
      </h2>

      {/* Top list / main content */}
      <div className="mb-12 space-y-4 text-base leading-relaxed text-main-text/80">
        {renderRichText(toplist as RichTextItem[])}
      </div>

      {/* Image */}
      <div className="flex justify-center">
        <div className="relative mb-12 h-[171px]  w-full lg:w-[1088px] overflow-hidden rounded-2xl md:h-[544px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Bottom text */}
      <div className="border-t border-main-grey/30 pt-8 text-base leading-relaxed text-main-text/80">
        {renderRichText(bottomText as RichTextItem[])}
      </div>
    </section>
  );
}
