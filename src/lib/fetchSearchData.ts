const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

export async function fetchSearchData() {
  const [categoriesRes, subcategoriesRes, tagsRes, articlesRes] = await Promise.all([
    fetch(`${BASE_URL}/api/categories/search?page=1&limit=100`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/subcategories/search?page=1&limit=100`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/tags/search?page=1&limit=100`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/articles/search?limit=100&sortBy=publishedAt&order=desc&published=true`, { cache: 'no-store' }),
  ]);

  const categoriesData = await categoriesRes.json().catch(() => null);
  const subcategoriesData = await subcategoriesRes.json().catch(() => null);
  const tagsData = await tagsRes.json().catch(() => null);
  const articlesData = await articlesRes.json().catch(() => null);

  return {
    categories: Array.isArray(categoriesData?.data) ? categoriesData.data : [],
    subcategories: Array.isArray(subcategoriesData?.data) ? subcategoriesData.data : [],
    tags: Array.isArray(tagsData?.data) ? tagsData.data : [],
    articles: Array.isArray(articlesData?.data) ? articlesData.data : [],
  };
}