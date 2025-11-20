export const allArticles = [
  {
    title: "Мале кіно — велика подія: Вінниця збирає кіномитців з усього світу",
    gradient: "bg-gradient-to-t from-blue-900/80 via-blue-900/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Кінофест"],
  },
  {
    title: "Назва статті може бути в декілька рядків",
    gradient: "bg-gradient-to-t from-red-800/80 via-red-800/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Новини"],
  },
  {
    title: "Як мистецтво впливає на суспільство та культурний розвиток міста",
    gradient: "bg-gradient-to-t from-red-800/80 via-red-800/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Культура"],
  },
  {
    title: "Новий напрямок: Стрічка про відомого режисера",
    gradient: "bg-gradient-to-t from-blue-900/80 via-blue-900/10 to-transparent",
    img: "/articles/articlePic2.jpg",
    tags: ["#MFKSTINA", "#Прем'єра"],
  },
  {
    title: "Світові тренди кіноіндустрії 2024 року",
    gradient: "bg-gradient-to-r from-blue-900/80 via-blue-900/10 to-transparent",
    img: "https://placehold.co/800x600/083344/ffffff?text=Article+5",
    tags: ["#Тренди", "#Кіно"],
  },
  {
    title: "Інтерв'ю з лауреатом премії фестивалю",
    gradient: "bg-gradient-to-r from-red-800/80 via-red-800/10 to-transparent",
    img: "https://placehold.co/800x600/991b1f/ffffff?text=Article+6",
    tags: ["#Лауреати", "#Інтерв'ю"],
  },
  {
    title: "Залаштунки зйомок: як створюється магія кіно",
    gradient: "bg-gradient-to-r from-red-800/80 via-red-800/10 to-transparent",
    img: "https://placehold.co/800x600/991b1f/ffffff?text=Article+7",
    tags: ["#Залаштунки", "#Зйомки"],
  },
  {
    title: "Огляд найкращих короткометражок року",
    gradient: "bg-gradient-to-r from-blue-900/80 via-blue-900/10 to-transparent",
    img: "https://placehold.co/800x600/083344/ffffff?text=Article+8",
    tags: ["#Огляд", "#Короткометражки"],
  },
] as const;

// Функція для групування по 4
export const groupArticles = (arr: typeof allArticles, size = 4) => {
  const grouped: (typeof allArticles[number][])[] = [];
  for (let i = 0; i < arr.length; i += size) {
    grouped.push(arr.slice(i, i + size));
  }
  return grouped;
};
