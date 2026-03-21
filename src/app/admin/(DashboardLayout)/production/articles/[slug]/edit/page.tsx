"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";
import ArticleForm, { ArticleFormData } from "../../../../components/articleForm";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticle({ params }: EditPageProps) {
  const { slug } = React.use(params);
  const router = useRouter();

  const [articleId, setArticleId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ArticleFormData> | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  fetch(`/api/articles/by-slug/${slug}`)
    .then((r) => r.json())
    .then((article) => {  
      setArticleId(article.id);
      setInitialData({
        title: article.title ?? "",
        lang: article.lang ?? "UK",
        body: article.body ?? { blocks: [] },
        authorName: article.author?.name ?? article.authorName ?? "",
        categoryId: article.categoryId ?? "",
        subcategoryIds: article.subcategories?.map((s: any) => s.id) ?? [],
        tags: article.tags?.map((t: any) => t.name) ?? [],
        currentImageId: article.imageId ?? null,
        coverBase64: article.image?.url ?? null,
        published: article.published ?? false,
        slider: article.slider ?? 'NONE',
        gradient: article.gradient ?? 'NONE',
      });
    })

    .catch(() => setError("Не вдалося завантажити статтю"))
    .finally(() => setFetching(false));
  }, [slug]);

  const handleSave = async (data: ArticleFormData) => {
    if (!data.title || !data.authorName || !data.categoryId) {
      setError("Заповніть обов'язкові поля: заголовок, автор, категорія");
      return;
    }
    if (!articleId) {
      setError("ID статті не знайдено");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Завантажуємо банер якщо є
      let imageId: number | null = null;

  if (data.coverBase64 && data.coverBase64.startsWith('data:')) {
    // Нова картинка — видаляємо стару і завантажуємо нову
    if (data.currentImageId) {
      await fetch(`/api/media/${data.currentImageId}`, { method: 'DELETE' });
    }

    const fetchRes = await fetch(data.coverBase64);
    const blob = await fetchRes.blob();
    const formData = new FormData();
    formData.append('file', blob, 'cover.jpg');

    const uploadRes = await fetch('/api/media', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!uploadRes.ok) throw new Error('Помилка завантаження банера');
    const uploadData = await uploadRes.json();
    imageId = uploadData.id;
  } else if (data.currentImageId) {
    // Картинка не змінилась — залишаємо старий imageId
    imageId = data.currentImageId;
  }
    

    // 2. Зберігаємо статтю
    const res = await fetch(`/api/articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        coverBase64: undefined, // не відправляємо base64 в тіло
        categoryId: Number(data.categoryId),
        tags: data.tags.map((name) => ({ name })),
        ...(imageId && { imageId }),
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || `Помилка ${res.status}`);
    }
    setSuccess(true);
    setTimeout(() => router.push("/admin/production/articles"), 1500);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <Container maxWidth="md">
        <Typography sx={{ mt: 4 }}>Завантаження...</Typography>
      </Container>
    );
  }

  if (!initialData) {
    return (
      <Container maxWidth="md">
        <Typography sx={{ mt: 4 }} color="error">Статтю не знайдено</Typography>
      </Container>
    );
  }

  return (
    <ArticleForm
      title="Редагувати статтю"
      submitLabel="Зберегти зміни"
      successMessage="Статтю успішно оновлено! Перенаправлення..."
      key={articleId ?? 'loading'}
      initialData={initialData}
      onSave={handleSave}
      loading={loading}
      error={error}
      success={success}
      onCancel={() => router.back()}
    />
  );
}
