// src/app/public/Search/page.tsx
import { fetchSearchData } from '@lib/fetchSearchData';
import SearchClient from './SearchClient';

export default async function SearchPage() {
  const { categories, subcategories, tags, articles } = await fetchSearchData();

  return (
    <SearchClient
      initialCategories={categories}
      initialSubcategories={subcategories}
      initialTags={tags}
      initialArticles={articles}
    />
  );
}