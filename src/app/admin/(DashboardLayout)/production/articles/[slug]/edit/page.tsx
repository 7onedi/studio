"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";
import ArticleForm, { ArticleFormData } from "../../../../components/articleForm";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticle({ params }: EditPageProps) {
  const { slug } = React.use(params);
  const router = useRouter();

  const [articleId, setArticleId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ArticleFormData> | null>(null);
  const [initialPublished, setInitialPublished] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [me, setMe] = useState<{ id: number; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(setMe);
  }, []);

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
        authorAvatarId: article.authorAvatarId ?? null,
        authorAvatarUrl: article.authorAvatar?.url ?? null,
        categoryId: article.categoryId ?? "",
        subcategoryIds: article.subcategories?.map((s: any) => s.id) ?? [],
        tags: article.tags?.map((t: any) => t.name) ?? [],
        currentImageId: article.imageId ?? null,
        coverBase64: article.image?.url ?? null,
        published: article.published ?? false,
        slider: article.slider ?? 'NONE',
        gradient: article.gradient ?? 'NONE',
      });
      setInitialPublished(article.published ?? false); 
    })

    .catch(() => setError("Не вдалося завантажити статтю"))
    .finally(() => setFetching(false));
  }, [slug]);

  const handleSave = async (data: ArticleFormData) => {
    if (!data.title || !data.authorName || !data.categoryId) {
      setError("Fill in the required fields: title, author, category");
      return;
    }
    if (!articleId) {
      setError("Article ID not found");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageId: number | null = null;

      if (data.coverBase64 && data.coverBase64.startsWith('data:')) {
        if (data.currentImageId) {
          await fetchWithAuth(`/api/media/${data.currentImageId}`, { method: 'DELETE' });
        }

        const fetchRes = await fetch(data.coverBase64);
        const blob = await fetchRes.blob();
        const formData = new FormData();
        formData.append('file', blob, 'cover.jpg');

        const uploadRes = await fetchWithAuth('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Error uploading cover image');
        const uploadData = await uploadRes.json();
        imageId = uploadData.id;
      } else if (data.currentImageId) {
        imageId = data.currentImageId;
      }

      const res = await fetchWithAuth(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          coverBase64: undefined,
          categoryId: Number(data.categoryId),
          tags: data.tags.map((name) => ({ name })),
          ...(imageId && { imageId }),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `Error ${res.status}`);
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
        <Typography sx={{ mt: 4 }}>Loading...</Typography>
      </Container>
    );
  }

  if (!initialData) {
    return (
      <Container maxWidth="md">
        <Typography sx={{ mt: 4 }} color="error">Article not found</Typography>
      </Container>
    );
  }

  return (
    <ArticleForm
      title="Edit Article"
      submitLabel="Save Changes"
      successMessage="Article updated successfully! Redirecting..."
      key={articleId ?? 'loading'}
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
