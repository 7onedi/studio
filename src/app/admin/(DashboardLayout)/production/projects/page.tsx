'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import ParentProjectTable from './ParentProjectTable';
import ChildProjectTable from './ChildProjectTable';
import ParentProjectFormDialog, { Category, ParentProject } from './ParentProjectFormDialog';
import ChildProjectFormDialog, { ChildProject } from './ChildProjectFormDialog';

function ProjectsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = Number(searchParams.get('tab') ?? '0');

  // --- батьківські ---
  const [parents, setParents]       = useState<ParentProject[]>([]);
  const [parentTotal, setParentTotal] = useState(0);
  const [parentLoading, setParentLoading] = useState(false);

  // --- дочірні ---
  const [children, setChildren]       = useState<ChildProject[]>([]);
  const [childTotal, setChildTotal]   = useState(0);
  const [childLoading, setChildLoading] = useState(false);

  // --- категорії для форм ---
  const [categories, setCategories] = useState<Category[]>([]);

  // --- зайняті підкатегорії ---
  const [usedSubcategoryIds, setUsedSubcategoryIds] = useState<number[]>([]);

  // --- форми ---
  const [parentFormOpen, setParentFormOpen] = useState(false);
  const [parentEditTarget, setParentEditTarget] = useState<ParentProject | undefined>();
  const [childFormOpen, setChildFormOpen] = useState(false);
  const [childEditTarget, setChildEditTarget] = useState<ChildProject | undefined>();

  // --- параметри ---
  const page   = searchParams.get('page')   ?? '1';
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const order  = searchParams.get('order')  ?? 'desc';
  const limit  = searchParams.get('limit')  ?? '15';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  // --- категорії ---
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : d.items ?? []))
      .catch(console.error);
  }, []);

  // --- зайняті підкатегорії (всі дочірні проекти) ---
  useEffect(() => {
    fetch('/api/studioprojects/search?limit=1000')
      .then((r) => r.json())
      .then((d) => {
        const all: ChildProject[] = Array.isArray(d.data) ? d.data : [];
        const used = all
          .filter((p) => p.parentId && p.subcategoryId)
          .map((p) => p.subcategoryId as number);
        setUsedSubcategoryIds(used);
      })
      .catch(console.error);
  }, []);

  // --- батьківські проекти ---
  useEffect(() => {
    if (tab !== 0) return;
    setParentLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order,  hasParent: 'false' });
    if (search) params.set('title', search);
    // лише батьківські — без parentId
    fetch(`/api/studioprojects/search?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setParents(Array.isArray(d.data) ? d.data : []);
        setParentTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setParentLoading(false));
  }, [tab, page, limit, search, sortBy, order]);

  // --- дочірні проекти ---
  useEffect(() => {
    if (tab !== 1) return;
    setChildLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order, hasParent: 'true' });
    if (search) params.set('title', search);
    fetch(`/api/studioprojects/search?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setChildren(Array.isArray(d.data) ? d.data : []);
        setChildTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setChildLoading(false));
  }, [tab, page, limit, search, sortBy, order]);

  // --- publish ---
  const handlePublish = async (id: number, currentPublished: boolean) => {
    if (!confirm(`${currentPublished ? 'Зняти з публікації' : 'Опублікувати'}?`)) return;
    try {
      const res = await fetch('/api/studioprojects/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`Помилка ${res.status}`);
      // оновлюємо стан
      if (tab === 0) {
        setParents((prev) =>
          prev.map((p) => p.id === id ? { ...p, published: !p.published } : p)
        );
      } else {
        setChildren((prev) =>
          prev.map((p) => p.id === id ? { ...p, published: !p.published } : p)
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // --- delete батьківського ---
  const handleParentDelete = async (id: number) => {
    if (!confirm('Видалити проект? Всі дочірні проекти також будуть видалені.')) return;
    const res = await fetch(`/api/studioprojects/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) return;
    setParents((prev) => prev.filter((p) => p.id !== id));
    setParentTotal((prev) => prev - 1);
  };

  const handleParentBulkDelete = async (ids: number[]) => {
    await Promise.all(ids.map((id) =>
      fetch(`/api/studioprojects/${id}`, { method: 'DELETE', credentials: 'include' })
    ));
    setParents((prev) => prev.filter((p) => !ids.includes(p.id)));
    setParentTotal((prev) => prev - ids.length);
  };

  // --- delete дочірнього ---
  const handleChildDelete = async (id: number) => {
    if (!confirm('Видалити дочірній проект?')) return;
    const res = await fetch(`/api/studioprojects/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) return;
    const deleted = children.find((c) => c.id === id);
    setChildren((prev) => prev.filter((p) => p.id !== id));
    setChildTotal((prev) => prev - 1);
    // звільняємо підкатегорію
    if (deleted?.subcategoryId) {
      setUsedSubcategoryIds((prev) => prev.filter((s) => s !== deleted.subcategoryId));
    }
  };

  const handleChildBulkDelete = async (ids: number[]) => {
    await Promise.all(ids.map((id) =>
      fetch(`/api/studioprojects/${id}`, { method: 'DELETE', credentials: 'include' })
    ));
    const deleted = children.filter((c) => ids.includes(c.id));
    setChildren((prev) => prev.filter((p) => !ids.includes(p.id)));
    setChildTotal((prev) => prev - ids.length);
    const freedSubs = deleted.map((d) => d.subcategoryId).filter(Boolean) as number[];
    setUsedSubcategoryIds((prev) => prev.filter((s) => !freedSubs.includes(s)));
  };

  // --- saved ---
  const handleParentSaved = (saved: ParentProject) => {
    setParents((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => p.id === saved.id ? saved : p);
      setParentTotal((t) => t + 1);
      return [saved, ...prev];
    });
  };

  const handleChildSaved = (saved: ChildProject) => {
    setChildren((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => p.id === saved.id ? saved : p);
      setChildTotal((t) => t + 1);
      // додаємо підкатегорію до зайнятих
      if (saved.subcategoryId) {
        setUsedSubcategoryIds((prev) => [...prev, saved.subcategoryId as number]);
      }
      return [saved, ...prev];
    });
  };

  return (
    <PageContainer title="Проекти" description="Управління проектами">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>Проекти</Typography>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={() => {
              if (tab === 0) { setParentEditTarget(undefined); setParentFormOpen(true); }
              else           { setChildEditTarget(undefined);  setChildFormOpen(true); }
            }}
          >
            {tab === 0 ? 'Новий проект' : 'Новий дочірній проект'}
          </Button>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', String(v));
            params.set('page', '1');
            params.delete('search');
            router.push(`${pathname}?${params}`);
          }}
          sx={{ mb: 3 }}
        >
          <Tab label="Батьківські проекти" />
          <Tab label="Дочірні проекти" />
        </Tabs>

        {tab === 0 && (
          <ParentProjectTable
            data={parents}
            total={parentTotal}
            loading={parentLoading}
            page={Number(page) - 1}
            pageSize={Number(limit)}
            search={search}
            sortBy={sortBy}
            order={order as 'asc' | 'desc'}
            onSearchChange={(val) => updateParam('search', val)}
            onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
            onPageChange={(p) => updateParam('page', String(p + 1))}
            onPageSizeChange={(size) => updateParam('limit', String(size))}
            onEdit={(p) => { setParentEditTarget(p); setParentFormOpen(true); }}
            onDelete={handleParentDelete}
            onBulkDelete={handleParentBulkDelete}
            onPublish={handlePublish}
          />
        )}

        {tab === 1 && (
          <ChildProjectTable
            data={children}
            total={childTotal}
            loading={childLoading}
            page={Number(page) - 1}
            pageSize={Number(limit)}
            search={search}
            sortBy={sortBy}
            order={order as 'asc' | 'desc'}
            onSearchChange={(val) => updateParam('search', val)}
            onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
            onPageChange={(p) => updateParam('page', String(p + 1))}
            onPageSizeChange={(size) => updateParam('limit', String(size))}
            onEdit={(p) => { setChildEditTarget(p); setChildFormOpen(true); }}
            onDelete={handleChildDelete}
            onBulkDelete={handleChildBulkDelete}
            onPublish={handlePublish}
          />
        )}
      </Box>

      <ParentProjectFormDialog
        open={parentFormOpen}
        initial={parentEditTarget}
        categories={categories}
        onClose={() => setParentFormOpen(false)}
        onSaved={handleParentSaved}
      />

      <ChildProjectFormDialog
        open={childFormOpen}
        initial={childEditTarget}
        categories={categories}
        usedSubcategoryIds={usedSubcategoryIds}
        onClose={() => setChildFormOpen(false)}
        onSaved={handleChildSaved}
      />
    </PageContainer>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsContent />
    </Suspense>
  );
}