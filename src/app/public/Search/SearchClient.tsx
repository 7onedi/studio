'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { BlogCard } from '@/app/public/blocks/BlogSlider/BlogCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { toCardProps } from '@blocks/BlogSlider/toCardProps';
import { useLanguage } from "@/app/providers/LanguageProvider";

interface Category { id: number; name: string; }
interface Subcategory { id: number; name: string; categoryId: number; }
interface Tag { id: number; name: string; }
interface Article {
  id: number;
  slug: string;
  title: string;
  authorName: string;
  published: boolean;
  category?: { id: number; name: string };
  subcategories?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  image?: { url: string };
  body?: any;
}

interface Props {
  initialCategories: Category[];
  initialSubcategories: Subcategory[];
  initialTags: Tag[];
  initialArticles: Article[];
}

function norm(s: string) {
  return (s ?? '').toLowerCase().trim();
}

const SEARCH_ROUTE = '/public/Search';

export default function SearchPageClient({
  initialCategories,
  initialSubcategories,
  initialTags,
  initialArticles,
}: Props) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const didInitFromUrl = useRef(false);

  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const allCategories = useMemo(
    () => initialCategories.map(c => c.name).sort((a, b) => a.localeCompare(b, 'uk')),
    [initialCategories]
  );

  const allSubCategories = useMemo(
    () => initialSubcategories.map(s => s.name).sort((a, b) => a.localeCompare(b, 'uk')),
    [initialSubcategories]
  );

  const allTags = useMemo(
    () => initialTags.map(t => t.name).sort((a, b) => a.localeCompare(b, 'uk')),
    [initialTags]
  );

  const filtered = useMemo(() => {
    const q = norm(query);

    return initialArticles.filter(a => {
      const haystack = norm([
        a.title,
        a.slug,
        a.category?.name ?? '',
        ...(a.subcategories?.map(s => s.name) ?? []),
        ...(a.tags?.map(t => t.name) ?? []),
      ].join(' '));

  const matchesQuery = q.length === 0 || q.length < 3 || haystack.includes(q);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(a.category?.name ?? '');

      const matchesSubCategory =
        selectedSubCategories.length === 0 ||
        (a.subcategories ?? []).some(s => selectedSubCategories.includes(s.name));

      const matchesTags =
        selectedTags.length === 0 ||
        (a.tags ?? []).some(t => selectedTags.includes(t.name));

      return matchesQuery && matchesCategory && matchesSubCategory && matchesTags;
    });
  }, [initialArticles, query, selectedCategories, selectedSubCategories, selectedTags]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page]
  );

  const hasAnyFilter =
    query.trim().length > 0 ||
    selectedTags.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0;

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleSubCategory = (sub: string) =>
    setSelectedSubCategories(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );

  const toggleTag = (tag: string) =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setPage(1);
    router.replace(SEARCH_ROUTE, { scroll: false });
  };

  // Ініціалізація з URL
  useEffect(() => {
    const tags = searchParams.getAll('tag').flatMap(v => v.split(',')).map(s => s.trim()).filter(Boolean);
    if (tags.length > 0) setSelectedTags(Array.from(new Set(tags)));

    const q = (searchParams.get('q') ?? '').trim();
    if (q) {
      if (allCategories.includes(q)) setSelectedCategories([q]);
      if (allSubCategories.includes(q)) setSelectedSubCategories([q]);
      if (allTags.includes(q)) setSelectedTags(prev => [...new Set([...prev, q])]);
    }

    didInitFromUrl.current = true;
  }, []);

  // Синхронізація URL
  useEffect(() => {
    if (!didInitFromUrl.current) return;

    const params = new URLSearchParams();
    selectedTags.forEach(t => params.append('tag', t));
    selectedCategories.forEach(c => params.append('cat', c));
    selectedSubCategories.forEach(s => params.append('sub', s));

    const qs = params.toString();
    router.replace(qs ? `${SEARCH_ROUTE}?${qs}` : SEARCH_ROUTE, { scroll: false });
  }, [selectedTags, selectedCategories, selectedSubCategories]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategories, selectedSubCategories, selectedTags]);
  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-6xl pt-10 lg:pt-14">
        <div className="mx-auto max-w-4xl">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="flex h-[54px] w-full items-center rounded-full bg-white/95 px-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-black/45"
              />
            </div>
            <button
              type="button"
              className="flex h-[54px] shrink-0 items-center gap-2 rounded-full bg-sky-600 px-6 text-[14px] font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:bg-sky-500"
              aria-label={t("search.search_button")}
            >
              <span className="hidden lg:flex">{t("search.search_button")}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Categories */}
          {allCategories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {allCategories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={[
                    'rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition',
                    selectedCategories.includes(c)
                      ? 'bg-main-amarant text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]'
                      : 'bg-main-amarant/70 text-white/95 hover:bg-main-amarant',
                  ].join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* SubCategories */}
          {allSubCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {allSubCategories.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSubCategory(s)}
                  className={[
                    'rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition',
                    selectedSubCategories.includes(s)
                      ? 'bg-main-amarant text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]'
                      : 'bg-main-amarant/70 text-white/95 hover:bg-main-amarant',
                  ].join(' ')}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {allTags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={[
                    'rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition',
                    selectedTags.includes(t)
                      ? 'bg-main-blue text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]'
                      : 'bg-main-blue/70 text-white/95 hover:bg-main-blue',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {hasAnyFilter && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="text-headline_5">
                {t("search.result")}: <span className="font-semibold text-[green]">{filtered.length}</span>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-main-amarant p-4 text-button font-semibold text-main-amarant transition hover:bg-main-amarant/90 hover:text-white/90"
              >
                {t("search.clear_button")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        {filtered.length === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-[18px] font-semibold text-main-text">{t("search.no_result")}</p>
            <p className="mt-2 text-[14px] text-main-gray/70">{t("search.no_result_description")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {paginatedArticles.map((article, i) => (
              <div key={article.slug ?? i} className="h-[260px] sm:h-[320px]">
                <BlogCard {...toCardProps(article)} />
              </div>
            ))}
          </div>
        )}
      </section>
      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-main-blue transition hover:bg-white/10 disabled:opacity-30"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | string)[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} className="px-1 text-white/40">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition',
                    page === p
                      ? 'bg-main-blue text-white shadow-lg'
                      : 'border border-white/20 text-main-blue hover:bg-white/10',
                  ].join(' ')}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-main-blue transition hover:bg-white/10 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}