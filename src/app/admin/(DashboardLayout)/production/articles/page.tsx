'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import ArticleTable, { Article } from '../../components/articleTable';

function ArticlesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = searchParams.get('page') ?? '1';
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const order = searchParams.get('order') ?? 'desc';
  const limit = searchParams.get('limit') ?? '15';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order });
    if (search) params.set('title', search);

    fetch(`/api/articles/search?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setArticles(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, limit, search, sortBy, order]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  return (
    <PageContainer title="Статті" description="Список статей">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Статті
          </Typography>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            href="/admin/production/articles/create"
          >
            Нова стаття
          </Button>
        </Box>

        <ArticleTable
          data={articles}
          total={total}
          loading={loading}
          page={Number(page) - 1}
          pageSize={Number(limit)}
          search={search}
          sortBy={sortBy}
          order={order as 'asc' | 'desc'}
          onSearchChange={(val) => updateParam('search', val)}
          onSortChange={(col, dir) => {
            updateParam('sortBy', col);
            updateParam('order', dir);
          }}
          onPageChange={(p) => updateParam('page', String(p + 1))}
          onPageSizeChange={(size) => updateParam('limit', String(size))}
        />
      </Box>
    </PageContainer>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense>
      <ArticlesContent />
    </Suspense>
  );
}