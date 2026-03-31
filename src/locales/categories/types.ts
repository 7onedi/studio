import type { RichTextItem } from "@/app/public/components/RenderRichText";

export type CategoryData = {
  id: number;
  title: string;
  image: string;
  pattern: string;
  gradient: string;
  hoverGradient: string;
  link: string;
  description: RichTextItem[];
};