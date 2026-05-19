  'use client';

  import { useState, useEffect, Suspense } from 'react';
  import { useSearchParams, useRouter, usePathname } from 'next/navigation';
  import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
  import { IconPlus } from '@tabler/icons-react';
  import PageContainer from '../../components/container/PageContainer';
  import TagsTable from './tagsTable';
  import TagsFormDialog, { Tags } from './tagsFormDialog';

  function TagsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tab = Number(searchParams.get('tab') ?? '0');

    // --- категорії ---
    const [Tags, setTegs] = useState<Tags[]>([]);
    const [tagTotal, setTegTotal] = useState(0);
    const [tagLoading, setTegLoading] = useState(false);


    // --- всі категорії для селекту у формі підкатегорії ---
    const [allTags, setAllTags] = useState<Tags[]>([]);

    // --- форми ---
    const [tagFormOpen, setTegFormOpen] = useState(false);
    const [tagEditTarget, setTegEditTarget] = useState<Tags | undefined>();
    const [subFormOpen, setSubFormOpen] = useState(false);

    // --- параметри ---
    const page    = searchParams.get('page')   ?? '1';
    const search  = searchParams.get('search') ?? '';
    const sortBy  = searchParams.get('sortBy') ?? 'createdAt';
    const order   = searchParams.get('order')  ?? 'desc';
    const limit   = searchParams.get('limit')  ?? '15';

    const updateParam = (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      if (key !== 'page') params.set('page', '1');
      router.push(`${pathname}?${params}`);
    };

    // --- завантаження всіх тегів для селекту ---
    useEffect(() => {
      fetch('/api/tags')
        .then((r) => r.json())
        .then((d) => setAllTags(Array.isArray(d) ? d : d.items ?? []))
        .catch(console.error);
    }, []);

    // --- завантаження тегів ---
    useEffect(() => {
      if (tab !== 0) return;
      setTegLoading(true);
      const params = new URLSearchParams({ page, limit, sortBy, order });
      if (search) params.set('name', search);
      fetch(`/api/tags/search?${params}`)
        .then((r) => r.json())
        .then((d) => {
          setTegs(Array.isArray(d.data) ? d.data : []);
          setTegTotal(d.total ?? 0);
        })
        .catch(console.error)
        .finally(() => setTegLoading(false));
    }, [tab, page, limit, search, sortBy, order]);


    // --- CRUD категорії ---
    const handletagDelete = async (id: number) => {
      if (!confirm('Видалити тег?')) return;
      const res = await fetch(`/api/tags/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) return;
      setTegs((prev) => prev.filter((c) => c.id !== id));
      setTegTotal((prev) => prev - 1);
    };

    const handletagBulkDelete = async (ids: number[]) => {
      await Promise.all(ids.map((id) => fetch(`/api/tags/${id}`, { method: 'DELETE', credentials: 'include' })));
      setTegs((prev) => prev.filter((c) => !ids.includes(c.id)));
      setTegTotal((prev) => prev - ids.length);
    };

    const handletagSaved = (saved: Tags) => {
      setTegs((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        if (exists) return prev.map((c) => c.id === saved.id ? saved : c);
        setTegTotal((t) => t + 1);
        return [saved, ...prev];
      });
      setAllTags((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        if (exists) return prev.map((c) => c.id === saved.id ? saved : c);
        return [saved, ...prev];
      });
    };

    return (
      <PageContainer title="Tags" description="List of tags">
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>Tags</Typography>
            <Button
              variant="contained"
              startIcon={<IconPlus size={16} />}
              onClick={() => {
                if (tab === 0) { setTegEditTarget(undefined); setTegFormOpen(true); }
              }}
            >
              {tab === 0 && 'New Tag'}
            </Button>
          </Box>

            <TagsTable
              data={Tags}
              total={tagTotal}
              loading={tagLoading}
              page={Number(page) - 1}
              pageSize={Number(limit)}
              search={search}
              sortBy={sortBy}
              order={order as 'asc' | 'desc'}
              onSearchChange={(val) => updateParam('search', val)}
              onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
              onPageChange={(p) => updateParam('page', String(p + 1))}
              onPageSizeChange={(size) => updateParam('limit', String(size))}
              onEdit={(tag) => { setTegEditTarget(tag); setTegFormOpen(true); }}
              onDelete={handletagDelete}
              onBulkDelete={handletagBulkDelete}
            />
        </Box>

        <TagsFormDialog
          open={tagFormOpen}
          initial={tagEditTarget}
          onClose={() => setTegFormOpen(false)}
          onSaved={handletagSaved}
        />
      </PageContainer>
    );
  }

  export default function TagsPage() {
    return (
      <Suspense>
        <TagsContent />
      </Suspense>
    );
  }