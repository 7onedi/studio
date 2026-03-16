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

      if (!uploadRes.ok) throw new Error('Помилка завантаження банера');
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
