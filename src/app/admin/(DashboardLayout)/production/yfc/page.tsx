'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Box, Typography, Button, Chip, IconButton,
  Stack, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import PageContainer from '../../components/container/PageContainer';
import SubcategoryTable from '../../components/SubcategoryTable';

// ---------------------------------------------------------------------------
// Типи
// ---------------------------------------------------------------------------

export interface Yfc {
  id: number;
  name: string;
  slug: string;
  lang: string;
  categoryId: number;
  category?: { id: number; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Форма створення / редагування підкатегорії
// ---------------------------------------------------------------------------

interface YfcFormDialogProps {
  open: boolean;
  initial?: Partial<Yfc>;
  /** id категорії CountrysideStudio — передається автоматично */
  categoryId: number;
  onClose: () => void;
  onSaved: (sub: Yfc) => void;
}

function YfcFormDialog({
  open, initial, categoryId, onClose, onSaved,
}: YfcFormDialogProps) {
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [lang, setLang] = useState(initial?.lang ?? 'uk');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset при відкритті
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setSlug(initial?.slug ?? '');
      setLang(initial?.lang ?? 'uk');
      setError('');
    }
  }, [open, initial]);

  // Автоматично генерує slug з назви
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-_]/g, ''),
      );
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Назва обовʼязкова'); return; }
    if (!slug.trim()) { setError('Slug обовʼязковий'); return; }
    setSaving(true);
    try {
      const url = isEdit
        ? `/api/subcategories/${initial!.id}`
        : '/api/subcategories';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, slug, lang, categoryId }),
      });
      if (!res.ok) throw new Error(`Помилка ${res.status}`);
      const saved: Yfc = await res.json();
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Редагувати підкатегорію' : 'Нова підкатегорія'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Назва"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            size="small"
            required
            helperText="Тільки латинські літери, цифри, дефіс"
          />
          <TextField
            label="Мова"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            fullWidth
            size="small"
            select
            SelectProps={{ native: true }}
          >
            <option value="uk">uk</option>
            <option value="en">en</option>
            <option value="pl">pl</option>
          </TextField>
          {error && (
            <Typography variant="caption" color="error">{error}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Скасувати</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Збереження...' : isEdit ? 'Зберегти' : 'Створити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Основний вміст сторінки
// ---------------------------------------------------------------------------

/** id категорії CountrysideStudio — змініть на реальний */
const COUNTRYSIDE_STUDIO_CATEGORY_ID = 1;

function YfcContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<Yfc[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Стан форми
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Yfc | undefined>();

  const page = searchParams.get('page') ?? '1';
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const order = searchParams.get('order') ?? 'desc';
  const limit = searchParams.get('limit') ?? '15';

  const CATEGORY_SLUG = '#CountrysideStudio';

// додай поруч із іншими useState:
const [categoryId, setCategoryId] = useState<number | null>(null);

// окремий useEffect — знаходить categoryId один раз при монтуванні:
useEffect(() => {
  fetch(`/api/categories/search?name=${encodeURIComponent(CATEGORY_SLUG)}&page=1&limit=1`)
    .then((r) => r.json())
    .then((d) => {
      const list: Array<{ id: number; slug: string }> = Array.isArray(d.data) ? d.data : [];
      const found = list.find((c) => c.slug === CATEGORY_SLUG) ?? list[0];
      setCategoryId(found?.id ?? null);
    })
    .catch(console.error);
}, []);

// основний useEffect — чекає на categoryId:
useEffect(() => {
  if (categoryId === null) return;

  setLoading(true);
  const params = new URLSearchParams({
    categoryId: String(categoryId),
    page,
    limit,
    sortBy,
    order,
  });
  if (search) params.set('name', search);

  fetch(`/api/subcategories/search?${params}`)
    .then((r) => r.json())
    .then((d) => {
      setRows(Array.isArray(d.data) ? d.data : []);
      setTotal(d.total ?? 0);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [categoryId, page, limit, search, sortBy, order]);

  // --- завантаження ---
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order, categoryId: String(COUNTRYSIDE_STUDIO_CATEGORY_ID) });
    if (search) params.set('name', search);

    fetch(`/api/subcategories?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setRows(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, limit, search, sortBy, order]);

  // --- хелпер оновлення URL ---
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  // --- видалення одного ---
  const handleDelete = async (id: number) => {
    if (!confirm('Видалити підкатегорію?')) return;
    try {
      const res = await fetch(`/api/subcategories/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(`Помилка ${res.status}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err: any) {
      console.error('Помилка видалення:', err.message);
    }
  };

  // --- bulk delete ---
  const handleBulkDelete = async (ids: number[]) => {
    await Promise.all(ids.map((id) => fetch(`/api/subcategories/${id}`, { method: 'DELETE', credentials: 'include' })));
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    setTotal((prev) => prev - ids.length);
  };

  // --- збережено (create / update) ---
  const handleSaved = (saved: Yfc) => {
    setRows((prev) => {
      const exists = prev.find((r) => r.id === saved.id);
      if (exists) return prev.map((r) => (r.id === saved.id ? saved : r));
      setTotal((t) => t + 1);
      return [saved, ...prev];
    });
  };

  // --- визначення колонок ---
  const columns: ColumnDef<Yfc>[] = [
    {
      accessorKey: 'name',
      header: 'Назва',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 220 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 220,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ fontFamily: 'monospace', fontSize: 12 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 200,
    },
    {
      accessorKey: 'lang',
      header: 'Мова',
      cell: ({ getValue }) => (
        <Chip label={getValue() as string} size="small" variant="filled" sx={{ fontWeight: 600, fontSize: 11 }} />
      ),
      size: 80,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Оновлено',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {format(new Date(getValue() as string), 'dd.MM.yyyy HH:mm')}
        </Typography>
      ),
      size: 140,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Редагувати">
            <IconButton
              size="small"
              onClick={() => { setEditTarget(row.original); setFormOpen(true); }}
            >
              <IconEdit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Видалити">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
              <IconTrash size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      size: 80,
    },
  ];

  return (
    <PageContainer title="Підкатегорії — CountrysideStudio" description="Управління підкатегоріями">
      <Box>
        {/* Шапка */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={600}>Підкатегорії</Typography>
            <Typography variant="body2" color="text.secondary">CountrysideStudio</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            href="/admin/production/yfc/create"
          >
            Нова підкатегорія
          </Button>
        </Box>

        {/* Таблиця */}
        <SubcategoryTable<Yfc>
          data={rows}
          total={total}
          columns={columns}
          sortableColumns={['name', 'updatedAt', 'lang']}
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
          onBulkDelete={handleBulkDelete}
          emptyText="Підкатегорій не знайдено"
        />
      </Box>

      {/* Форма створення / редагування */}
      <YfcFormDialog
        open={formOpen}
        initial={editTarget}
        categoryId={COUNTRYSIDE_STUDIO_CATEGORY_ID}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default function Yfc() {
  return (
    <Suspense>
      <YfcContent />
    </Suspense>
  );
}