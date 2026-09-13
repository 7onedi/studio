'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Button, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { IconPlus, IconFilterOff } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import ArticleTable, { Article } from '../../components/articleTable';

const LANGS = [
  { code: '', icon: null, label: 'All' },
  { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
  { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
  { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
  { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
  { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
];

const SLIDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'NONE', label: 'Do not display' },
  { value: 'SLIDER_1', label: 'Banner-Slider' },
  { value: 'SLIDER_2', label: 'Carousel-Slider' },
];

function ArticlesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: number; role: string } | null>(null);
  // прибираємо локальний useState для фільтрів

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(setMe);
  }, []);

  const page = searchParams.get('page') ?? '1';
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const order = searchParams.get('order') ?? 'desc';
  const limit = searchParams.get('limit') ?? '15';
  const lang = searchParams.get('lang') ?? '';
  const mine = searchParams.get('mine') === '1';
  const slider = searchParams.get('slider') ?? '';
  const categoryFilter = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const subcategoryFilter = searchParams.get('subcategoryId') ? Number(searchParams.get('subcategoryId')) : undefined;

  useEffect(() => {
    if (!me) return;

    setLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order });
    if (search) params.set('title', search);
    if (lang) params.set('lang', lang);
    if (slider) params.set('slider', slider);
    if (me.role === 'USER' || mine) params.set('authorId', String(me.id));
    if (categoryFilter) params.set('categoryId', String(categoryFilter));
    if (subcategoryFilter) params.set('subcategoryId', String(subcategoryFilter));

    fetch(`/api/articles/search?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setArticles(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, limit, search, sortBy, order, lang, slider, me, mine, categoryFilter, subcategoryFilter]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const toggleMine = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (!mine) {
      params.set('mine', '1');
    } else {
      params.delete('mine');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  return (
    <PageContainer title="Articles" description="List of articles">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Articles
          </Typography>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            href="/admin/production/articles/create"
          >
            New Article
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs
            value={lang}
            onChange={(_, v) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('lang', v);
              params.set('page', '1');
              router.push(`${pathname}?${params}`);
            }}
          >
            {LANGS.map((l) => (
              <Tab
                key={l.code}
                value={l.code}
                label={
                  <Box display="flex" alignItems="center" gap={0.75}>
                    {l.icon && (
                      <img src={l.icon} width={24} height={24} alt={l.label} style={{ borderRadius: 2 }} />
                    )}
                    {l.label}
                  </Box>
                }
              />
            ))}
          </Tabs>

          <Box display="flex" alignItems="center" gap={1.5}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="slider-filter-label" shrink>Slider placement</InputLabel>
              <Select
                labelId="slider-filter-label"
                label="Slider placement"
                value={slider}
                displayEmpty
                renderValue={(val) => SLIDER_OPTIONS.find((o) => o.value === val)?.label ?? 'All'}
                onChange={(e) => updateParam('slider', e.target.value)}
              >
                {SLIDER_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {me?.role !== 'USER' && (
              <Button
                size="small"
                variant={mine ? 'contained' : 'outlined'}
                onClick={toggleMine}
              >
                My articles
              </Button>
            )}

            <Tooltip title="Clear filters and sort">
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push(pathname)}
              >
                <IconFilterOff size={16} />
              </Button>
            </Tooltip>
          </Box>
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
            updateParams({ sortBy: col, order: dir });
          }}
          onPageChange={(p) => updateParam('page', String(p + 1))}
          onPageSizeChange={(size) => updateParam('limit', String(size))}
          userRole={me?.role}
          userId={me?.id}
          categoryFilter={categoryFilter}
          subcategoryFilter={subcategoryFilter}
          onCategoryFilterChange={(catId) => {
            const isActive = categoryFilter === catId && !subcategoryFilter;
            updateParams({
              categoryId: isActive ? null : String(catId),
              subcategoryId: null,
            });
          }}
          onSubcategoryFilterChange={(catId, subId) => {
            const isActive = subcategoryFilter === subId;
            updateParams({
              categoryId: isActive ? null : String(catId),
              subcategoryId: isActive ? null : String(subId),
            });
          }}
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