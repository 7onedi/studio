"use client";

import React, { useMemo, useState, useRef } from "react";
import { slides } from "@/app/public/blocks/ArticleSlider/slideContent";
import { BlogCard } from "@/app/public/blocks/BlogSlider/BlogCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/app/public/components/Button"

type Article = (typeof slides)[number];

function norm(s: string) {
  return (s ?? "").toLowerCase().trim();
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default function SearchPage() {
  // беремо лише list (як у BlogSlider), плюс published
  const allArticles = useMemo(() => {
    return (slides as readonly Article[]).filter(
      (a) =>
        a?.meta?.status === "published"
    );
  }, []);

  const allTags = useMemo(() => {
    const tags = allArticles.flatMap((a) => [...(a.meta.tags ?? [])]);
    return uniq(tags)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "uk"));
  }, [allArticles]);

  const didInitFromUrl = useRef(false);
const SEARCH_ROUTE = "/public/Search"; // важливо: той самий регістр, що і твій роут


  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  

  const searchParams = useSearchParams();
  const router = useRouter();

  const allCategories = useMemo(() => {
  const cats = allArticles.map((a) => a.meta.category).filter(Boolean);
  return uniq(cats).sort((a, b) => a.localeCompare(b, "uk"));
  }, [allArticles]);

  const allSubCategories = useMemo(() => {
  const subs = allArticles
    .map((a) => a.meta.SubCategory ?? "")
    .filter(Boolean);
    return uniq(subs).sort((a, b) => a.localeCompare(b, "uk"));
    }, [allArticles]);

    const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

const toggleSubCategory = (sub: string) => {
  setSelectedSubCategories((prev) =>
    prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
  );
};

const filtered = useMemo(() => {
  const q = norm(query);

  return allArticles.filter((a) => {
    const haystack = norm(
      [
        a.meta.title,
        a.meta.description,
        a.meta.slug,
        a.meta.category,
        a.meta.SubCategory ?? "",
        ...(a.meta.tags ?? []),
      ].join(" ")
    );

    const matchesQuery = q.length === 0 ? true : haystack.includes(q);

    const matchesCategory =
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(a.meta.category);

    const matchesSubCategory =
      selectedSubCategories.length === 0
        ? true
        : selectedSubCategories.includes(a.meta.SubCategory ?? "");

    const matchesTags =
      selectedTags.length === 0
        ? true
        : (a.meta.tags ?? []).some((t) => selectedTags.includes(t));

    return matchesQuery && matchesCategory && matchesSubCategory && matchesTags;
  });
}, [allArticles, query, selectedCategories, selectedSubCategories, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

const hasAnyFilter =
    query.trim().length > 0 ||
    selectedTags.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0;

useEffect(() => {
  const fromUrl = searchParams
    .getAll("tag")
    .flatMap((v) => v.split(","))
    .map((s) => s.trim());

  const cleaned = fromUrl.filter(Boolean);

  if (cleaned.length > 0) {
    setSelectedTags((prev) => Array.from(new Set([...prev, ...cleaned])));
  }

  didInitFromUrl.current = true;
}, [searchParams]);

useEffect(() => {
  if (!didInitFromUrl.current) return;

  // будуємо params з нуля по стану
  const params = new URLSearchParams();

  // якщо захочеш підтримати текстовий запит в URL — додаси тут
  // if (query.trim()) params.set("query", query.trim());

  selectedTags.forEach((t) => params.append("tag", t));
  selectedCategories.forEach((c) => params.append("cat", c));
  selectedSubCategories.forEach((s) => params.append("sub", s));

  const qs = params.toString();

  // ✅ прибираємо q після редіректу автоматично, бо ми його не додаємо в params
  router.replace(qs ? `${SEARCH_ROUTE}?${qs}` : SEARCH_ROUTE, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedTags, selectedCategories, selectedSubCategories]);


useEffect(() => {
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) {
    didInitFromUrl.current = true;
    return;
  }

  // 1) якщо це існуюча категорія — активуємо категорію
  if (allCategories.includes(q)) {
    setSelectedCategories((prev) => (prev.includes(q) ? prev : [...prev, q]));
  }

  // 2) якщо це існуюча підкатегорія — активуємо підкатегорію
  if (allSubCategories.includes(q)) {
    setSelectedSubCategories((prev) => (prev.includes(q) ? prev : [...prev, q]));
  }

  // 3) якщо це існуючий тег — активуємо тег
  if (allTags.includes(q)) {
    setSelectedTags((prev) => (prev.includes(q) ? prev : [...prev, q]));
  }

  didInitFromUrl.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchParams, allCategories, allSubCategories, allTags]);



const clearFilters = () => {
  setQuery("");
  setSelectedTags([]);
  setSelectedCategories([]);
  setSelectedSubCategories([]);
  router.replace(SEARCH_ROUTE, { scroll: false });
};

  return (
    <main className=" pb-20">
      {/* TOP SEARCH AREA */}
      <section className="mx-auto w-full max-w-6xl pt-10 lg:pt-14">
        <div className="mx-auto max-w-4xl">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="flex h-[54px] w-full items-center rounded-full bg-white/95 px-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введіть ваш запит"
                className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-black/45"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                // просто залишаємо state; якщо хочеш — можна фокус/submit
              }}
              className="flex h-[54px] shrink-0 items-center gap-2 rounded-full bg-sky-600 px-6 text-[14px] font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:bg-sky-500 active:scale-[0.99]"
              aria-label="Шукати"
            >
              <span className="hidden lg:flex">шукати</span> 
              {/* маленька лупа */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-95"
              >
                <path
                  d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

            {/* Categories */}
            {allCategories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                {allCategories.map((c) => {
                const active = selectedCategories.includes(c);
                return (
                    <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={[
                        "rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition",
                        active
                        ? "bg-main-blue text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]"
                        : "bg-main-blue/70 text-white/95 hover:bg-main-blue",
                    ].join(" ")}
                    >
                    {c}
                    </button>
                );
                })}
            </div>
            )}

            {/* SubCategories */}
            {allSubCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-3">
                {allSubCategories.map((s) => {
                const active = selectedSubCategories.includes(s);
                return (
                    <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubCategory(s)}
                    className={[
                        "rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition",
                        active
                        ? "bg-main-blue text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]"
                        : "bg-main-blue/70 text-white/95 hover:bg-main-blue",
                    ].join(" ")}
                    >
                    {s}
                    </button>
                );
                })}
            </div>
            )}
            {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
                {allTags.map((t) => {
                const active = selectedTags.includes(t);
                return (
                    <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={[
                        "rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition",
                        active
                        ? "bg-main-amarant text-white shadow-[0_10px_25px_rgba(0.35,0.35,0.35,0.7)]"
                        : "bg-main-amarant/70 text-white/95 hover:bg-main-amarant",
                    ].join(" ")}
                    >
                    {t}
                    </button>
                );
                })}
            </div>
            )}


          {/* Active filters small row */}
        {hasAnyFilter && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="text-headline_5">
            Знайдено: <span className="font-semibold text-[green]">{filtered.length}</span>
            </div>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-main-amarant p-4 text-button font-semibold text-main-amarant transition hover:bg-main-amarant/90 hover:text-white/90"
              >
                Очистити фільтри
              </button>
            
        </div>
        )}
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        {filtered.length === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-[18px] font-semibold text-white">
              Нічого не знайдено
            </p>
            <p className="mt-2 text-[14px] text-white/70">
              Спробуй змінити запит або зняти частину тегів.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {filtered.map((article, i) => (
              <div key={article.meta.slug ?? i} className="h-[260px] sm:h-[320px]">
                <BlogCard {...(article as any)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
