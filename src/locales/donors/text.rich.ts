import type { RichTextItem } from "@/app/public/components/RenderRichText";

export type DonorItem = {
  id: number;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: RichTextItem[];
};