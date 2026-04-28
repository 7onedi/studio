'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import YfcForm, { YfcFormData } from '../../../components/YfcForm';

const COUNTRYSIDE_STUDIO_CATEGORY_ID = 1;

export default function CreateYfcPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (data: YfcFormData) => {
    if (!data.name || !data.lat || !data.lng) {
      setError("Заповніть обов'язкові поля: назва, slug, координати");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Завантажуємо банер якщо вибрали файл
      let imageId: number | null = null;
      if (data.imageBase64) {
        const blob = await (await fetch(data.imageBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'banner.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Помилка завантаження банера');
        const json = await res.json();
        imageId = json.id;
      }

      // 2. Завантажуємо лого якщо вибрали файл
      let logoId: number | null = null;
      if (data.logoBase64) {
        const blob = await (await fetch(data.logoBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'logo.png');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Помилка завантаження лого');
        const json = await res.json();
        logoId = json.id;
      }

      const payload = {
        title:      data.name,
        body:       data.body,
        categoryId: data.categoryId,
        imageId:    imageId ?? undefined,
        locationData: {
          name: data.name,
          url:  data.websiteUrl || 'https://pangeya.org.ua', // fallback якщо не заповнили
          coordinates: {
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng),
          },
        },
        socialLinks: data.iconNames
          .filter((s) => s.link.trim())
          .map((s) => ({
            platform: s.title.toUpperCase(),
            url:      s.link,
          })),
      };

      const res = await fetch('/api/studioprojects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `Помилка ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/production/yfc'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YfcForm
      title="Створити YFC клуб"
      submitLabel="Створити клуб"
      successMessage="Клуб успішно створено! Перенаправлення..."
      categoryId={COUNTRYSIDE_STUDIO_CATEGORY_ID}
      onSave={handleSave}
      loading={loading}
      error={error}
      success={success}
      onCancel={() => router.back()}
    />
  );
}