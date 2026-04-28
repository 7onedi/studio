const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function getParentProject(categoryName: string) {
  const catRes = await fetch(`${BASE_URL}/api/categories/search?name=${encodeURIComponent(categoryName)}&limit=1`);
  const catData = await catRes.json();
  const categoryId = catData.data?.[0]?.id;
  if (!categoryId) return null;

  const res = await fetch(`${BASE_URL}/api/studioprojects/search?categoryId=${categoryId}&limit=100`);
  const data = await res.json();
  const all = Array.isArray(data.data) ? data.data : [];

  const parent = all.find((p: any) => !p.parentId) ?? null;
  const children = all.filter((p: any) => p.parentId);

  return { parent, children, categoryId };
}