export async function getCategoryId(name: string): Promise<number | null> {
  const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

  const res = await fetch(
    `${BASE_URL}/api/categories/search?name=${encodeURIComponent(name)}&page=1&limit=1`,
    { cache: 'force-cache' }
  );

  const data = await res.json().catch(() => null);
  const results = Array.isArray(data?.data) ? data.data : [];

  return results[0]?.id ?? null;
}