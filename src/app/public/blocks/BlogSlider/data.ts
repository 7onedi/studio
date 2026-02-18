import { slides } from "../ArticleSlider/slideContent";

export const listSlides = slides.filter(
  (a) => a.meta.placement?.[0] === "list"
);

export const groupArticles = (
  arr: typeof listSlides,
  size = 4
) => {
  const grouped: (typeof listSlides[number][])[] = [];

  for (let i = 0; i < arr.length; i += size) {
    grouped.push(arr.slice(i, i + size));
  }

  return grouped;
};
