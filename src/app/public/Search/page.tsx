import { fetchSearchData } from '@lib/fetchSearchData';
import SearchClient from './SearchClient';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { categories, subcategories, tags, articles, total, initialFilters } =
    await fetchSearchData(sp);

  return (
    <SearchClient
      initialCategories={categories}
      initialSubcategories={subcategories}
      initialTags={tags}
      initialArticles={articles}
      initialTotal={total}
      initialFilters={initialFilters}
    />
  );
}