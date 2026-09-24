const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';
const ITEMS_PER_PAGE = 10;

type SP = Record<string, string | string[] | undefined>;

const readList = (sp: SP, key: string): string[] => {
  const raw = sp[key];
  const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return Array.from(
    new Set(arr.flatMap(v => v.split(',')).map(s => s.trim()).filter(Boolean))
  );
};

export async function fetchSearchData(sp: SP = {}) {
  const [categoriesRes, subcategoriesRes, tagsRes] = await Promise.all([
    fetch(`${BASE_URL}/api/categories/search?page=1&limit=100`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/subcategories/search?page=1&limit=100`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/tags/search?page=1&limit=100`, { cache: 'no-store' }),
  ]);

  const categoriesData = await categoriesRes.json().catch(() => null);
  const subcategoriesData = await subcategoriesRes.json().catch(() => null);
  const tagsData = await tagsRes.json().catch(() => null);

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const subcategories = Array.isArray(subcategoriesData?.data) ? subcategoriesData.data : [];
  const tags = Array.isArray(tagsData?.data) ? tagsData.data : [];

  // Вибрані фільтри з URL (?tag=, ?cat=, ?sub=, ?q=)
  let selTags = readList(sp, 'tag');
  let selCats = readList(sp, 'cat');
  let selSubs = readList(sp, 'sub');

  const rawQ = sp.q;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim();
  if (q) {
    if (categories.some((c: any) => c.name === q)) selCats = Array.from(new Set([...selCats, q]));
    if (subcategories.some((s: any) => s.name === q)) selSubs = Array.from(new Set([...selSubs, q]));
    if (tags.some((t: any) => t.name === q)) selTags = Array.from(new Set([...selTags, q]));
  }

  const toIds = (list: any[], names: string[]) =>
    list.filter(x => names.includes(x.name)).map(x => x.id);

  const params = new URLSearchParams({
    page: '1',
    limit: String(ITEMS_PER_PAGE),
    sortBy: 'publishedAt',
    order: 'desc',
    published: 'true',
  });
  const catIds = toIds(categories, selCats);
  const subIds = toIds(subcategories, selSubs);
  const tagIds = toIds(tags, selTags);
  if (catIds.length) params.set('categoryIds', catIds.join(','));
  if (subIds.length) params.set('subcategoryIds', subIds.join(','));
  if (tagIds.length) params.set('tagIds', tagIds.join(','));

  const articlesRes = await fetch(`${BASE_URL}/api/articles/search?${params}`, { cache: 'no-store' });
  const articlesData = await articlesRes.json().catch(() => null);

  return {
    categories,
    subcategories,
    tags,
    articles: Array.isArray(articlesData?.data) ? articlesData.data : [],
    total: articlesData?.total ?? 0,
    initialFilters: { tags: selTags, cats: selCats, subs: selSubs },
  };
}