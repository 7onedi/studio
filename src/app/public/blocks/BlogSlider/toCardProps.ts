export function toCardProps(article: any) {
  if (article?.meta) return article;

  const categoryName = article.category?.name ?? '';
  const subCategoryName = article.subcategories?.[0]?.name ?? '';
  const tags = (article.tags ?? [])
    .map((t: any) => (typeof t === 'string' ? t : t?.name ?? ''))
    .filter(Boolean);
const g = article.gradient;

const gradient =
  g === 'GRADIENT_1'
    ? 'bg-gradient-to-t from-main-blue/70 via-main-blue/25 to-transparent'
    : g === 'GRADIENT_2'
    ? 'bg-gradient-to-t from-main-amarant/70 via-main-amarant/25 to-transparent'
    : '';

  return {
    meta: {
      slug: article.slug ?? '',
      title: article.title ?? '',
      category: categoryName,
      SubCategory: subCategoryName,
      tags,
      placement: ['list'],
    },
    hero: {
      img: article.image?.url ?? null,
      gradient,
    },
  };
}