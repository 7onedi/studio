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
import MapMarkerFormDialog, { MapMarkerProject } from './MapMarkerFormDialog';
import MapMarkerTable from './MapMarkerTable';

function ProjectsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [me, setMe] = useState<{ id: number; role: string } | null>(null);

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

  // --- маркери ---
  const [markers, setMarkers] = useState<MapMarkerProject[]>([]);
  const [markerTotal, setMarkerTotal] = useState(0);
  const [markerLoading, setMarkerLoading] = useState(false);
  const [markerFormOpen, setMarkerFormOpen] = useState(false);
  const [markerEditTarget, setMarkerEditTarget] = useState<MapMarkerProject | undefined>();
  const [allProjects, setAllProjects] = useState<{ id: number; title: string }[]>([]);

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

  const imagemappingCategoryId = categories.find((c) => c.name === 'Imagemapping')?.id ?? 0;

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(setMe);
  }, []);

  const userRole = me?.role;

  const isOwner = userRole === 'OWNER';
  const tab = isOwner ? Number(searchParams.get('tab') ?? 0) : 1;

  // --- категорії ---
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : d.items ?? []))
      .catch(console.error);
  }, []);

  // --- зайняті підкатегорії (всі дочірні проекти) ---
  useEffect(() => {
    fetch('/api/studioprojects/search?limit=1000&includeMarkers=true')
      .then((r) => r.json())
      .then((d) => {
        const all: ChildProject[] = Array.isArray(d.data) ? d.data : [];
        const used = all
          .filter((p) => p.subcategoryId)
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

  // список усіх проектів як кандидатів на parentId (і батьківські, і дочірні — одна шкала id)
  useEffect(() => {
    if (!imagemappingCategoryId) return;
    fetch(`/api/studioprojects/search?limit=1000&categoryId=${imagemappingCategoryId}&hasParent=true`)
      .then((r) => r.json())
      .then((d) => setAllProjects((Array.isArray(d.data) ? d.data : []).map((p: any) => ({ id: p.id, title: p.title_en || p.title }))))
      .catch(console.error);
  }, [imagemappingCategoryId]);

  // маркери
  useEffect(() => {
    if (tab !== 2) return;
    setMarkerLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order, onlyMarkers: 'true' });
    if (search) params.set('title', search);
    fetch(`/api/studioprojects/search?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setMarkers(Array.isArray(d.data) ? d.data : []);
        setMarkerTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setMarkerLoading(false));
  }, [tab, page, limit, search, sortBy, order]);

  // --- publish ---
  const handlePublish = async (id: number, currentPublished: boolean) => {
    if (!confirm(`${currentPublished ? 'Unpublish' : 'Publish'}?`)) return;
    try {
      const res = await fetch('/api/studioprojects/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      if (tab === 0) {
        setParents((prev) =>
          prev.map((p) => p.id === id ? { ...p, published: !p.published } : p)
        );
      } else if (tab === 1) {
        setChildren((prev) =>
          prev.map((p) => p.id === id ? { ...p, published: !p.published } : p)
        );
      } else {
        setMarkers((prev) =>
          prev.map((m) => m.id === id ? { ...m, published: !m.published } : m)
        );
      }
    } catch (err: any) {
      alert(err.message ?? 'Failed to update publish status');
    }
  };

  // --- delete батьківського ---
  const handleParentDelete = async (id: number) => {
    if (!confirm('Delete parent project? All child projects will also be deleted.')) return;
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
    if (!confirm('Delete child project?')) return;
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
    <PageContainer title="Projects" description="Management of projects">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>Projects</Typography>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={() => {
              if (tab === 0) { setParentEditTarget(undefined); setParentFormOpen(true); }
              else if (tab === 1) { setChildEditTarget(undefined); setChildFormOpen(true); }
              else { setMarkerEditTarget(undefined); setMarkerFormOpen(true); }
            }}
          >
            {tab === 0 ? 'New Parent Project' : tab === 1 ? 'New Project' : 'New Marker'}
          </Button>
        </Box>

        {isOwner && (
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
            <Tab label="Parent Projects" />
            <Tab label="Projects" />
            <Tab label="Imagemapping" />
          </Tabs>
        )}

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
            userRole={userRole}
          />
        )}

        {tab === 2 && (
          <MapMarkerTable
            data={markers}
            total={markerTotal}
            loading={markerLoading}
            page={Number(page) - 1}
            pageSize={Number(limit)}
            search={search}
            sortBy={sortBy}
            order={order as 'asc' | 'desc'}
            onSearchChange={(val) => updateParam('search', val)}
            onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
            onPageChange={(p) => updateParam('page', String(p + 1))}
            onPageSizeChange={(size) => updateParam('limit', String(size))}
            onEdit={(m) => { setMarkerEditTarget(m); setMarkerFormOpen(true); }}
            onDelete={handleChildDelete}
            onBulkDelete={handleChildBulkDelete}
            onPublish={handlePublish}
            userRole={userRole}
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

      <MapMarkerFormDialog
        open={markerFormOpen}
        initial={markerEditTarget}
        imagemappingCategoryId={imagemappingCategoryId}
        parentCandidates={allProjects}
        usedSubcategoryIds={usedSubcategoryIds}
        onClose={() => setMarkerFormOpen(false)}
        onSaved={(saved) => {
          setMarkers((prev) => {
            const exists = prev.find((m) => m.id === saved.id);
            if (exists) return prev.map((m) => m.id === saved.id ? saved : m);
            setMarkerTotal((t) => t + 1);
            return [saved, ...prev];
          });
          if (saved.subcategoryId) {
            setUsedSubcategoryIds((prev) => [...prev, saved.subcategoryId as number]);
          }
        }}
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