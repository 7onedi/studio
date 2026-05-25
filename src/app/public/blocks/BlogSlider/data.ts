import { slides } from "../ArticleSlider/slideContent";

export const listSlides = slides.filter(
  (a) => a.meta.placement?.[0] === "list"
);

export const groupArticles = (arr: any[], size = 4) => {
  if (arr.length === 0) return [];
  
  const grouped: any[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    const group = arr.slice(i, i + size);
    
    // Якщо група неповна — добираємо з початку
    if (group.length < size && arr.length > size) {
      let j = 0;
      while (group.length < size) {
        group.push(arr[j % arr.length]);
        j++;
      }
    }
    
    grouped.push(group);
  }

  return grouped;
};
