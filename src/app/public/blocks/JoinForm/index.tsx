"use client";

import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import { partnersData } from "../../AboutNetwork/Partners.data";
import { Button } from "@/app/public/components/Button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage} from "@/app/providers/LanguageProvider";

interface JoinFormProps {
  title?: RichTextItem[];
  description?: RichTextItem[];
}

export default function JoinForm({ title = [], description = [] }: JoinFormProps) {
  const { t } = useLanguage(); 
  return (
    <form className="w-full p-4 lg:py-8 lg:px-32 text-center rounded-2xl border border-main-amarant bg-white shadow-lg">
        <h2 className="mb-6 text-headline_4_mobile lg:text-headline_4 font-semibold text-main-text">
          {renderRichText(title)}
        </h2>

        <p className="mb-4 text-subtitle_1_mobile lg:text-subtitle_1 leading-relaxed text-main-text/80">
          {renderRichText(description)}
        </p>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder={t("join.name_placeholder")}
          className="w-full border-b border-main-grey bg-transparent py-2 text-sm outline-none"
          disabled
        />

        <input
          type="email"
          placeholder="email@gmail.com"
          className="w-full border-b border-main-grey bg-transparent py-2 text-sm outline-none"
          disabled
        />
      </div>

      <div className="mb-6 text-body text-left text-main-text">
        <p className="mb-3">
          {t("join.member_type_description")}
        </p>

        <div className="space-y-2">
          {[t("join.membership_types.member"), t("join.membership_types.donor"), t("join.membership_types.partner")].map((item) => (
            <label key={item} className="flex items-center gap-2" >
              <input type="radio" name="role" className="w-6 h-6 my-1" disabled/>
                {item}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-12 mb-2 flex flex-cols justify-center items-center">
        <Image
          src="/svg/Double_LeftArrow.svg"
          alt="Left Arrow"
          width={95}
          height={80}
          className="lg:mr-4 w-[74px] h-[60px] lg:w-[95px] lg:h-[80px]"
        />
        <Button variant="primary" className="!text-button_mobile lg:!text-button">
          <Link href="https://pangeya.org.ua/#join">{t("join.join_us")}</Link>
        </Button>
        <Image
          src="/svg/Double_RightArrow.svg"
          alt="Right Arrow"
          width={95}
          height={80}
          className="lg:ml-4 w-[74px] h-[60px] lg:w-[95px] lg:h-[80px]"
        />
      </div>

    </form>
  );
}
