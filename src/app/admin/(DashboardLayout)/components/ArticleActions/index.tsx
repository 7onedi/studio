'use client';

import { useRouter } from 'next/navigation';
import { Stack, Tooltip, IconButton } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface Props {
  id: number;
  slug: string;
}

export default function ArticleActions({ id, slug }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Видалити статтю?')) return;
    try {
      // Спочатку отримуємо статтю щоб знати imageId
      const articleRes = await fetch(`/api/articles/${id}`);
      const article = await articleRes.json();

      // Видаляємо статтю
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Помилка ${res.status}`);

      // Видаляємо картинку якщо є
      if (article.imageId) {
        await fetch(`/api/media/${article.imageId}`, { method: 'DELETE' });
      }

      router.push('/admin/production/articles');
    } catch (err: any) {
      console.error('Помилка видалення:', err.message);
    }
  };

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Редагувати">
        <IconButton size="small" href={`/admin/production/articles/${slug}/edit`}>
          <IconEdit size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Видалити">
        <IconButton size="small" color="error" onClick={handleDelete}>
          <IconTrash size={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}