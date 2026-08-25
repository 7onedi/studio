"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleForm, { ArticleFormData } from "../../../components/articleForm";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

function CreateArticleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateSlug = searchParams.get('duplicate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ArticleFormData> | undefined>(undefined);
  const [me, setMe] = useState<{ id: number; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(setMe);
  }, []);

  useEffect(() => {
    if (!duplicateSlug) return;
    fetch(`/api/articles/by-slug/${duplicateSlug}`)
      .then(r => r.json())
      .then(article => {
        setInitialData({
          title: article.title + ' (duplicate)',
          lang: article.lang,
          body: article.body,
          authorName: article.author?.name ?? article.authorName ?? '',
          authorAvatarId: article.authorAvatarId ?? null,
          authorAvatarUrl: article.authorAvatar?.url ?? null,
          categoryId: article.categoryId,
          subcategoryIds: article.subcategories?.map((s: any) => s.id) ?? [],
          tags: article.tags?.map((t: any) => t.name) ?? [],
          coverBase64: article.image?.url ?? null,
          currentImageId: article.imageId ?? null,
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
    let imageId: number | null = data.currentImageId ?? null;

    if (data.coverBase64 && !data.currentImageId) {
      const fetchRes = await fetch(data.coverBase64);
      const blob = await fetchRes.blob();
      const formData = new FormData();
      formData.append('file', blob, 'cover.jpg');
      const uploadRes = await fetchWithAuth('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Error uploading cover');
      const uploadData = await uploadRes.json();
      imageId = uploadData.id;
    }

    const res = await fetchWithAuth(`/api/articles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        coverBase64: undefined,
        categoryId: Number(data.categoryId),
        tags: data.tags.map((name) => ({ name })),
        ...(imageId && { imageId }),
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData?.message || `Error ${res.status}`);
    }
    if (data.published && resData.id) {
      await fetchWithAuth('/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      userRole={me?.role}
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
