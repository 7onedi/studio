import type { RichTextItem } from "@/app/public/components/RenderRichText";

export type PartnerCard = {
  id: number;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  // description: string;
  link: string;
};

export type PartnersData = {
  topic: string;
  subtitle1: string;
  subtitle2: string;
  title: RichTextItem[];
  description: RichTextItem[];
  partnersCards: PartnerCard[];
};