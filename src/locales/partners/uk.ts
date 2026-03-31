import type { PartnersData } from "./text.rich";

export const partnersDataUk: PartnersData = {
  topic: "Про мережу",
  subtitle1: "Наші донори",
  subtitle2: "Наші партнери",
  title: [{ strong: "Стань частиною ICYS!" }],
  description: [
      { strong: "Підтримка ЄС. "},
      "Завдяки цій співпраці ми маємо змогу ",
      "залучати міжнародний досвід та створювати сталі культурні  ",
      "проєкти в Україні.",
  ],
partnersCards: [
    { id: 1, image: { src: "/partners/partners_1.webp", alt: "ГО Центр Розвитку  ПАНГЕЯ УЛЬТІМА" }, title: "ГО Центр Розвитку  ПАНГЕЯ УЛЬТІМА", link: "https://pangeya.org.ua/" },
    { id: 2, image: { src: "/partners/partners_2.webp", alt: "Stina partner 2" }, title: "ЕКО-ЦЕНТР СТІНА", link: "https://stina.pangeya.org.ua/selo-stina" },
    { id: 3, image: { src: "/partners/partners_3.webp", alt: "Програма ЄС" }, title: "Департамент соціальної та молодіжної політики Вінницької ОДА", link: "https://www.vin.gov.ua/dep-smp" },
    // { id: 4, image: { src: "/mfk/mfkLogo/mfkLogo1.png", alt: "Stina partner 4" }, title: "Партнер 4", description: "Опис партнера 4" },
    // { id: 5, image: { src: "/partners/Co-f_EU.png", alt: "Програма ЄС" }, title: "Партнер 5", description: "Опис партнера 5" },
    // { id: 6, image: { src: "/mfk/mfkLogo/mfkLogo1.png", alt: "Stina partner 6" }, title: "Партнер 6", description: "Опис партнера 6" },
  ],
};