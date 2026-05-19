  'use client';

  import { useState, useEffect, Suspense } from 'react';
  import { useSearchParams, useRouter, usePathname } from 'next/navigation';
  import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
  import { IconPlus } from '@tabler/icons-react';
  import PageContainer from '../../components/container/PageContainer';
  import CategoryTable from './CategoryTable';
  import SubcategoryTable from './SubcategoryTable';
  import CategoryFormDialog, { Category } from './CategoryFormDialog';
  import SubcategoryFormDialog, { Subcategory } from './SubcategoryFormDialog';

  function CategoriesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tab = Number(searchParams.get('tab') ?? '0');

    // --- категорії ---
    const [categories, setCategories] = useState<Category[]>([]);
    const [catTotal, setCatTotal] = useState(0);
    const [catLoading, setCatLoading] = useState(false);

    // --- підкатегорії ---
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [subLoading, setSubLoading] = useState(false);

    // --- всі категорії для селекту у формі підкатегорії ---
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    // --- форми ---
    const [catFormOpen, setCatFormOpen] = useState(false);
    const [catEditTarget, setCatEditTarget] = useState<Category | undefined>();
    const [subFormOpen, setSubFormOpen] = useState(false);
    const [subEditTarget, setSubEditTarget] = useState<Subcategory | undefined>();

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

    // --- завантаження всіх категорій для селекту ---
    useEffect(() => {
      fetch('/api/categories')
        .then((r) => r.json())
        .then((d) => setAllCategories(Array.isArray(d) ? d : d.items ?? []))
        .catch(console.error);
    }, []);

    // --- завантаження категорій ---
    useEffect(() => {
      if (tab !== 0) return;
      setCatLoading(true);
      const params = new URLSearchParams({ page, limit, sortBy, order });
      if (search) params.set('name', search);
      fetch(`/api/categories/search?${params}`)
        .then((r) => r.json())
        .then((d) => {
          setCategories(Array.isArray(d.data) ? d.data : []);
          setCatTotal(d.total ?? 0);
        })
        .catch(console.error)
        .finally(() => setCatLoading(false));
    }, [tab, page, limit, search, sortBy, order]);

    // --- завантаження підкатегорій ---
    useEffect(() => {
      if (tab !== 1) return;
      setSubLoading(true);
      const params = new URLSearchParams({ page, limit, sortBy, order });
      if (search) params.set('name', search);
      fetch(`/api/subcategories/search?${params}`)
        .then((r) => r.json())
        .then((d) => {
          setSubcategories(Array.isArray(d.data) ? d.data : []);
          setSubTotal(d.total ?? 0);
        })
        .catch(console.error)
        .finally(() => setSubLoading(false));
    }, [tab, page, limit, search, sortBy, order]);

    // --- CRUD категорії ---
    const handleCatDelete = async (id: number) => {
      if (!confirm('Видалити категорію?')) return;
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) return;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setCatTotal((prev) => prev - 1);
    };

    const handleCatBulkDelete = async (ids: number[]) => {
      await Promise.all(ids.map((id) => fetch(`/api/categories/${id}`, { method: 'DELETE', credentials: 'include' })));
      setCategories((prev) => prev.filter((c) => !ids.includes(c.id)));
      setCatTotal((prev) => prev - ids.length);
    };

    const handleCatSaved = (saved: Category) => {
      setCategories((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        if (exists) return prev.map((c) => c.id === saved.id ? saved : c);
        setCatTotal((t) => t + 1);
        return [saved, ...prev];
      });
      setAllCategories((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        if (exists) return prev.map((c) => c.id === saved.id ? saved : c);
        return [saved, ...prev];
      });
    };

    // --- CRUD підкатегорії ---
    const handleSubDelete = async (id: number) => {
      if (!confirm('Видалити підкатегорію?')) return;
      const res = await fetch(`/api/subcategories/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) return;
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      setSubTotal((prev) => prev - 1);
    };

    const handleSubBulkDelete = async (ids: number[]) => {
      await Promise.all(ids.map((id) => fetch(`/api/subcategories/${id}`, { method: 'DELETE', credentials: 'include' })));
      setSubcategories((prev) => prev.filter((s) => !ids.includes(s.id)));
      setSubTotal((prev) => prev - ids.length);
    };

    const handleSubSaved = (saved: Subcategory) => {
      setSubcategories((prev) => {
        const exists = prev.find((s) => s.id === saved.id);
        if (exists) return prev.map((s) => s.id === saved.id ? saved : s);
        setSubTotal((t) => t + 1);
        return [saved, ...prev];
      });
    };

    return (
      <PageContainer title="Categories" description="List of categories and subcategories">
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>Categories</Typography>
            <Button
              variant="contained"
              startIcon={<IconPlus size={16} />}
              onClick={() => {
                if (tab === 0) { setCatEditTarget(undefined); setCatFormOpen(true); }
                else           { setSubEditTarget(undefined); setSubFormOpen(true); }
              }}
            >
              {tab === 0 ? 'New Category' : 'New Subcategory'}
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
            <Tab label="Categories" />
            <Tab label="Subcategories" />
          </Tabs>

          {tab === 0 && (
            <CategoryTable
              data={categories}
              total={catTotal}
              loading={catLoading}
              page={Number(page) - 1}
              pageSize={Number(limit)}
              search={search}
              sortBy={sortBy}
              order={order as 'asc' | 'desc'}
              onSearchChange={(val) => updateParam('search', val)}
              onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
              onPageChange={(p) => updateParam('page', String(p + 1))}
              onPageSizeChange={(size) => updateParam('limit', String(size))}
              onEdit={(cat) => { setCatEditTarget(cat); setCatFormOpen(true); }}
              onDelete={handleCatDelete}
              onBulkDelete={handleCatBulkDelete}
            />
          )}

          {tab === 1 && (
            <SubcategoryTable
              categories={allCategories}
              data={subcategories}
              total={subTotal}
              loading={subLoading}
              page={Number(page) - 1}
              pageSize={Number(limit)}
              search={search}
              sortBy={sortBy}
              order={order as 'asc' | 'desc'}
              onSearchChange={(val) => updateParam('search', val)}
              onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
              onPageChange={(p) => updateParam('page', String(p + 1))}
              onPageSizeChange={(size) => updateParam('limit', String(size))}
              onEdit={(sub) => { setSubEditTarget(sub); setSubFormOpen(true); }}
              onDelete={handleSubDelete}
              onBulkDelete={handleSubBulkDelete}
            />
          )}
        </Box>

        <CategoryFormDialog
          open={catFormOpen}
          initial={catEditTarget}
          onClose={() => setCatFormOpen(false)}
          onSaved={handleCatSaved}
        />

        <SubcategoryFormDialog
          open={subFormOpen}
          initial={subEditTarget}
          categories={allCategories}
          onClose={() => setSubFormOpen(false)}
          onSaved={handleSubSaved}
        />
      </PageContainer>
    );
  }

  export default function CategoriesPage() {
    return (
      <Suspense>
        <CategoriesContent />
      </Suspense>
    );
  }