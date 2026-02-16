import type { RichTextItem } from "@components/RenderRichText";

export const partnersData: {
  topic: string;
  subtitle1: string;
  subtitle2: string;
  title: RichTextItem[];
  description: RichTextItem[];
  partnersCards: {
    id: number;
    image: {
      src: string;
      alt: string;
    };
    title: string;
    description: string;
  }[];
} = {
  topic: "Про мережу",
  subtitle1: "Наші донори",
  subtitle2: "Наші партнери",
  title: [{ strong: "Стати частиною ICYS" }],
  description: [
    "Підтримай молодь та наші ініціативи — ",
    "долучайся до спільноти донорів і допоможи ",
    "втілювати важливі проєкти вже сьогодні.",
  ],
  partnersCards: [
    {
      id: 1,
      image: {
        src: "/partners/Co-f_EU.png",
        alt: "Co-funded by the European Union",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
    {
      id: 2,
      image: {
        src: "/mfk/mfkLogo/mfkLogo1.png",
        alt: "Stina partner 2",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
    {
      id: 3,
      image: {
        src: "/partners/Co-f_EU.png",
        alt: "EU Programme",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
        {
      id: 4,
      image: {
        src: "/mfk/mfkLogo/mfkLogo1.png",
        alt: "Stina partner 4",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
        {
      id: 5,
      image: {
        src: "/partners/Co-f_EU.png",
        alt: "EU Programme",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
    {
      id: 6,
      image: {
        src: "/mfk/mfkLogo/mfkLogo1.png",
        alt: "Stina partner 6",
      },
      title: "Партнер 1",
      description: "Опис партнера 1",
    },
  ],
};
