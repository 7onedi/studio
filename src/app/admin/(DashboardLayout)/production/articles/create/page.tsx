"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArticleForm, { ArticleFormData } from "../../../components/articleForm";

export default function CreateArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (data: ArticleFormData) => {
    if (!data.title || !data.authorName || !data.categoryId) {
      setError("Заповніть обов'язкові поля: заголовок, автор, категорія");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          categoryId: Number(data.categoryId),
          tags: data.tags.map((name) => ({ name })),
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

  return (
    <ArticleForm
      title="Створити статтю"
      submitLabel="Створити статтю"
      successMessage="Статтю успішно створено! Перенаправлення..."
      onSave={handleSave}
      loading={loading}
      error={error}
      success={success}
      onCancel={() => router.back()}
    />
  );
}
