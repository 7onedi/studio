export function toCardProps(article: any) {
  if (article?.meta) return article;

  const categoryName = article.category?.name ?? '';
  const subCategoryName = article.subcategories?.[0]?.name ?? '';
  const tags = (article.tags ?? [])
    .map((t: any) => (typeof t === 'string' ? t : t?.name ?? ''))
    .filter(Boolean);

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
      gradient: '',
    },
  };
}