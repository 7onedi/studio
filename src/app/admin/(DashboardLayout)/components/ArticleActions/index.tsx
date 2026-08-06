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
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const articleRes = await fetch(`/api/articles/${id}`);
      const article = await articleRes.json();

      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      if (article.imageId) {
        await fetch(`/api/media/${article.imageId}`, { method: 'DELETE' });
      }

      router.push('/admin/production/articles');
    } catch (err: any) {
      console.error('Error deleting article:', err.message);
    }
  };

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Edit">
        <IconButton size="small" href={`/admin/production/articles/${slug}/edit`}>
          <IconEdit size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="error" onClick={handleDelete}>
          <IconTrash size={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}