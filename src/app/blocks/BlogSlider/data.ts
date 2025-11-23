export const allArticles = [
  {
    title: "Печерний монастир у Яланецькій скелі",
    gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FRemains%20of%20the%20Rock%20Monastery%2FMonk.jpg?alt=media&token=dd2dc251-d643-4cce-939e-9060276bb9b0",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/cave-monastery"
  },
  {
    title: 'Жіночий ансамбль "Русава"',
    gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FRusava%20choir%2FChoir%20of%20Stina.JPG?alt=media&token=178c6ba7-763b-4ad3-a762-f5e4cd6337be",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/rusava-ensemble"
  },
  {
    title: "Погорений млин",
    gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FBurnt%20Mill%2FBurnt%20Mill%202.jpg?alt=media&token=4ee4f878-92fc-4f7c-a1aa-dda4fda74e44",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: ""
  },
  {
    title: 'Жива Картина "Image Mapping"',
    gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FAlive%20picture%2FImage%20Mapping.JPG?alt=media&token=b9bb0292-cc23-4d45-bff1-594e601e5274",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/alive-picture-stina"
  },
  {
    title: "СКраєзнавчий музей",
    gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FMuseum%20of%20local%20lore%2FLocal%20lore%20museum.JPG?alt=media&token=d70f6459-1686-4b35-86e0-08be2bcf1791",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/museum"
  },
  {
    title: `"Фігура" при в'їзді в село`,
    gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FMain%20figure%2FMain%20figure%204.jpg?alt=media&token=e2586204-136b-4cb8-8404-e56b2b0e109a",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/Main_figure"
  },
  {
    title: 'Пасіка "На Лісовій"',
    gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FPasika%20na%20Lisoviy%2Fviber_image_2024-08-20_13-41-53-403.webp?alt=media&token=78716c87-0329-4c08-9fa4-056e8e512779",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/pasika-na-lisoviy"
  },
  {
    title: "Замкова гора",
    gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
    img: "https://firebasestorage.googleapis.com/v0/b/stina-5526f.appspot.com/o/files%2FCastle%20hill%2FCastle%20hill.jpg?alt=media&token=05dd0b49-f103-4752-a9b1-e5feac0e141c",
    tags: ["#stinamfk", "#ecocenterstina"],
    link: "https://stina.pangeya.org.ua/selo-stina/category/local-attractions/articles/castle-hill"
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
