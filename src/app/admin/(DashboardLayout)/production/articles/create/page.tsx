"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleForm, { ArticleFormData } from "../../../components/articleForm";

function CreateArticleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateSlug = searchParams.get('duplicate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ArticleFormData> | undefined>(undefined);

  useEffect(() => {
    if (!duplicateSlug) return;
    fetch(`/api/articles/by-slug/${duplicateSlug}`)
      .then(r => r.json())
      .then(article => {
        setInitialData({
          title: article.title + ' (копія)',
          lang: article.lang,
          body: article.body,
          authorName: article.author?.name ?? article.authorName ?? '',
          categoryId: article.categoryId,
          subcategoryIds: article.subcategories?.map((s: any) => s.id) ?? [],
          tags: article.tags?.map((t: any) => t.name) ?? [],
          coverBase64: article.image?.url ?? null,
          currentImageId: null,
          published: false,
          slider: article.slider ?? 'NONE',
          gradient: article.gradient ?? 'NONE',
        });
      });
  }, [duplicateSlug]);

const handleSave = async (data: ArticleFormData) => {
  if (!data.title || !data.authorName || !data.categoryId) {
    setError("Fill in the required fields: title, author, category");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    // 1. Завантажуємо банер якщо є
    let imageId: number | null = null;

    if (data.coverBase64) {
      const fetchRes = await fetch(data.coverBase64);
      const blob = await fetchRes.blob();
      const formData = new FormData();
      formData.append('file', blob, 'cover.jpg');
      const uploadRes = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!uploadRes.ok) throw new Error('Error uploading cover');
      const uploadData = await uploadRes.json();
      console.log('uploadData:', uploadData);
      imageId = uploadData.id;
      console.log('imageId:', imageId);
      
    }

    console.log('imageId before fetch:', imageId);
    console.log('coverBase64 exists:', !!data.coverBase64);
    // 2. Зберігаємо статтю
    const res = await fetch(`/api/articles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        coverBase64: undefined, // не відправляємо base64 в тіло
        categoryId: Number(data.categoryId),
        tags: data.tags.map((name) => ({ name })),
        ...(imageId && { imageId }),
      }),
      
    });

    const resData = await res.json();
    console.log('response:', resData); 

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || `Error ${res.status}`);
    }
    if (data.published && resData.id) {
      await fetch('/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: resData.id }),
      });
    }
    setSuccess(true);
    setTimeout(() => router.push("/admin/production/articles"), 1500);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

if (duplicateSlug && !initialData) return null;

  return (
    <ArticleForm
      key={duplicateSlug ?? 'new'}
      title="Create Article"
      submitLabel="Create Article"
      successMessage="Article created successfully! Redirecting..."
      initialData={initialData}
      onSave={handleSave}
      loading={loading}
      error={error}
      success={success}
      onCancel={() => router.back()}
    />
  );
}

export default function CreateArticle() {
  return (
    <Suspense>
      <CreateArticleContent />
    </Suspense>
  );
}
