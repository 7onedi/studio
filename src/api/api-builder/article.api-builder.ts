export const ArticleInclude = {
  category: { select: { id: true, name: true, slug: true } },
  subcategories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true } },
  image: { select: { id: true, url: true } },
};