import type { RichTextItem } from "@components/RenderRichText";

export type DonorItem = {
  id: number;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: RichTextItem[];
};

export const donorsData: DonorItem[] = [
  {
    id: 1,
    image: {
      src: "/partners/Co-f_EU.png",
      alt: "Co-funded by the European Union",
    },
    title: "Co-founded by the european union",
    description: [
      { strong: "Стати частиною ICYS " },
      "Підтримай молодь та наші ініціативи — долучися до спільноти донорів і допоможи втілювати важливі проєкти вже сьогодні.",
    ],
  },
  {
    id: 2,
    image: {
      src: "/partners/Co-f_EU.png",
      alt: "European Union support",
    },
    title: "Co-founded by the european union",
    description: [
      { strong: "Підтримка ЄС. " },
      "Завдяки цій співпраці ми маємо змогу залучати міжнародний досвід та створювати сталі культурні проєкти в Україні.",
    ],
  },
  {
    id: 3,
    image: {
      src: "/partners/Co-f_EU.png",
      alt: "EU Programme",
    },
    title: "Co-founded by the european union",
    description: [
      { strong: "Міжнародне партнерство. " },
      "Програма сприяє розвитку локальних ініціатив та інтеграції української молоді в європейський культурний простір.",
    ],
  },
  {
    id: 4,
    image: {
      src: "/partners/Co-f_EU.png",
      alt: "EU Donor",
    },
    title: "Co-founded by the european union",
    description: [
      { strong: "Сталий розвиток. " },
      "Підтримка донорів дозволяє масштабувати діяльність та працювати з громадами по всій країні.",
    ],
  },
];
