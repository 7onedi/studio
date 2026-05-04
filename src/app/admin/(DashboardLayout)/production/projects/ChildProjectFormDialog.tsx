'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, IconButton, Divider,
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import ContributorsList from './ContributorsList';
import { Contributor } from './ContributorCard';
import dynamic from 'next/dynamic';
import { Category, ParentProject, SocialLink } from './ParentProjectFormDialog';
import { Switch, FormControlLabel } from '@mui/material';

const ReactEditor = dynamic(() => import('../../components/editor/ReactEditor'), { ssr: false });

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

export interface ChildProject {
  id: number;
  title: string;
  categoryId: number;
  subcategoryId?: number;
  parentId?: number;
  category?: Category;
  subcategory?: Subcategory;
  parent?: ParentProject;
  published?: boolean;
}

interface Props {
  open: boolean;
  initial?: Partial<ChildProject & {
    body: unknown;
    imageBase64?: string | null;
    imageId?: number | null;
    lat: string;
    lng: string;
    websiteUrl: string;
    socialLinks: SocialLink[];
  }>;
  categories: Category[];
  /** Список підкатегорій вже зайнятих дочірніми проектами */
  usedSubcategoryIds?: number[];
  onClose: () => void;
  onSaved: (project: ChildProject) => void;
}

const PLATFORMS = ['YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'WEBSITE'];

function ImageUploadBox({
  previewSrc, existingUrl, onUpload, onRemove, inputId, label,
}: {
  previewSrc: string | null;
  existingUrl: string | null;
  onUpload: (base64: string) => void;
  onRemove: () => void;
  inputId: string;
  label?: string;
}) {
  const src = previewSrc ?? existingUrl ?? null;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>{label}</Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: src ? 'primary.main' : 'grey.300',
          borderRadius: 2, p: 2, textAlign: 'center',
          cursor: 'pointer', position: 'relative',
          minHeight: 120, display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {src ? (
          <>
            <Box component="img" src={src}
              sx={{ maxWidth: '100%', maxHeight: 160, borderRadius: 1 }} />
            <Button size="small" color="error" variant="contained"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              Видалити
            </Button>
          </>
        ) : (
          <Typography color="text.secondary" fontSize={14}>
            Натисніть щоб завантажити
          </Typography>
        )}
      </Box>
      <input id={inputId} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onUpload(reader.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />
    </Box>
  );
}

export default function ChildProjectFormDialog({
  open, initial, categories, usedSubcategoryIds = [], onClose, onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);

  const [categoryId, setCategoryId]     = useState<number | ''>('');
  const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
  const [parentId, setParentId]         = useState<number | ''>('');
  const [content, setContent]           = useState<unknown>(null);
  const [imageBase64, setImageBase64]   = useState<string | null>(null);
  const [logoBase64, setLogoBase64]     = useState<string | null>(null);
  const [zoom, setZoom]               = useState<boolean>(false);
  const [lat, setLat]                   = useState('');
  const [lng, setLng]                   = useState('');
  const [websiteUrl, setWebsiteUrl]     = useState('');
  const [socials, setSocials]           = useState<SocialLink[]>([{ platform: 'INSTAGRAM', url: '' }]);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  // --- залежні дані ---
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [parentProjects, setParentProjects] = useState<ParentProject[]>([]);
  const [loadingSubs, setLoadingSubs]     = useState(false);
  const [loadingParents, setLoadingParents] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const selectedSub = subcategories.find((s) => s.id === Number(subcategoryId));
  const title = selectedSub?.name ?? '';
  const [fullData, setFullData] = useState<any>(null);
  useEffect(() => {
    if (open) {
      setCategoryId(initial?.categoryId ?? '');
      setSubcategoryId(initial?.subcategoryId ?? '');
      setParentId(initial?.parentId ?? '');
      setContent(initial?.body ?? null);
      setImageBase64(initial?.imageBase64 ?? null);
      setLat(initial?.lat ?? '');
      setLng(initial?.lng ?? '');
      setWebsiteUrl(initial?.websiteUrl ?? '');
      setContributors(fullData?.body?.contributors ?? []);
      setZoom((fullData?.body as any)?.zoom ?? (initial?.body as any)?.zoom ?? false);
      setSocials(initial?.socialLinks?.length
        ? initial.socialLinks
        : [{ platform: 'INSTAGRAM', url: '' }]);
      setError('');
    }
  }, [open, initial]);

// завантажуємо повні дані при відкритті форми редагування
useEffect(() => {
  if (!open || !initial?.id) {
    setFullData(null);
    return;
  }
  fetch(`/api/studioprojects/${initial.id}`)
    .then((r) => r.json())
    .then((d) => setFullData(d))
    .catch(console.error);
}, [open, initial?.id]);

// заповнюємо форму після отримання даних
useEffect(() => {
  if (!open) return;
  setCategoryId(fullData?.categoryId ?? initial?.categoryId ?? '');
  setSubcategoryId(fullData?.subcategoryId ?? initial?.subcategoryId ?? '');
  setParentId(fullData?.parentId ?? initial?.parentId ?? '');
  setContent(fullData?.body ?? initial?.body ?? null);
  setLat(String(fullData?.location?.coordinates?.lat ?? initial?.lat ?? ''));
  setLng(String(fullData?.location?.coordinates?.lng ?? initial?.lng ?? ''));
  setWebsiteUrl(fullData?.location?.url ?? initial?.websiteUrl ?? '');
  setSocials(
    fullData?.socialLinks?.length
      ? fullData.socialLinks.map((s: any) => ({ platform: s.social?.platform ?? s.platform, url: s.url }))
      : [{ platform: 'INSTAGRAM', url: '' }]
  );
  setImageBase64(null);
  setLogoBase64(null);
  setZoom((fullData?.body as any)?.zoom ?? (initial?.body as any)?.zoom ?? false);
  setError('');
}, [open, fullData]);

  // --- підкатегорії по categoryId ---
  useEffect(() => {
    if (!categoryId) { setSubcategories([]); setSubcategoryId(''); return; }
    setLoadingSubs(true);
    fetch(`/api/subcategories/search?categoryId=${categoryId}&limit=100`)
      .then((r) => r.json())
      .then((d) => setSubcategories(Array.isArray(d.data) ? d.data : []))
      .catch(console.error)
      .finally(() => setLoadingSubs(false));
  }, [categoryId]);

  // --- батьківські проекти по categoryId ---
  useEffect(() => {
    if (!categoryId) { setParentProjects([]); setParentId(''); return; }
    setLoadingParents(true);
    fetch(`/api/studioprojects/search?categoryId=${categoryId}&limit=100`)
      .then((r) => r.json())
      .then((d) => {
        // лише батьківські (без parentId)
        const all = Array.isArray(d.data) ? d.data : [];
        setParentProjects(all.filter((p: ParentProject & { parentId?: number | null }) => !p.parentId));
      })
      .catch(console.error)
      .finally(() => setLoadingParents(false));
  }, [categoryId]);

  const handleClose = () => {
    setFullData(null);
    onClose();
  };

  const updateSocial = (idx: number, field: keyof SocialLink, val: string) =>
    setSocials((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const handleSubmit = async () => {
    if (!title.trim())   { setError("Назва обов'язкова"); return; }
    if (!categoryId)     { setError('Оберіть категорію'); return; }
    if (!subcategoryId)  { setError('Оберіть підкатегорію'); return; }
    if (!parentId)       { setError('Оберіть батьківський проект'); return; }

    // перевірка що підкатегорія не зайнята (лише при створенні)
    if (!isEdit && usedSubcategoryIds.includes(Number(subcategoryId))) {
      setError('Ця підкатегорія вже використовується іншим проектом');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // 1. Завантаження банера
      let imageId: number | null = initial?.imageId ?? null;
      if (imageBase64) {
        const blob = await (await fetch(imageBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'banner.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Помилка завантаження банера');
        imageId = (await res.json()).id;
      }

      let logoId: number | null = fullData?.logoId ?? null;
      if (logoBase64) {
        const blob = await (await fetch(logoBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'logo.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Помилка завантаження лого');
        logoId = (await res.json()).id;
      }

      // 2. Збереження
      const url = isEdit
        ? `/api/studioprojects/${initial!.id}`
        : '/api/studioprojects';

      const payload = {
        title,
        categoryId:    Number(categoryId),
        subcategoryId: Number(subcategoryId),
        parentId:      Number(parentId),
        body: {
          ...(content as any ?? { blocks: [] }),
          contributors,
          zoom,
        },
        ...(imageId && { imageId }),
        ...(logoId && { logoId }),
        locationData: {
          name:        title,
          url: websiteUrl || `https://studio.pangeya.org.ua/${selectedSub?.slug ?? subcategoryId}-${Date.now()}`,
          coordinates: {
            lat: parseFloat(lat) || 0,
            lng: parseFloat(lng) || 0,
          },
        },
        socialLinks: socials
          .filter((s) => s.url.trim())
          .map((s) => ({ platform: s.platform, url: s.url })),
      };

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `Помилка ${res.status}`);
      }

      onSaved(await res.json());
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редагувати дочірній проект' : 'Новий дочірній проект'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          {/* Категорія */}
          <TextField
            select label="Категорія *" value={categoryId}
            onChange={(e) => {
              setCategoryId(Number(e.target.value));
              setSubcategoryId('');
              setParentId('');
            }}
            fullWidth size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>

          {/* Підкатегорія */}
          <TextField
            select label="Підкатегорія *" value={subcategoryId}
            onChange={(e) => setSubcategoryId(Number(e.target.value))}
            fullWidth size="small"
            disabled={!categoryId || loadingSubs}
            helperText={!categoryId ? 'Спочатку оберіть категорію' : ''}
          >
            {subcategories.map((s) => (
              <MenuItem
                key={s.id}
                value={s.id}
                disabled={!isEdit && usedSubcategoryIds.includes(s.id)}
              >
                {s.name}
                {!isEdit && usedSubcategoryIds.includes(s.id) ? ' (зайнято)' : ''}
              </MenuItem>
            ))}
          </TextField>

          {/* Батьківський проект */}
          <TextField
            select label="Батьківський проект *" value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
            fullWidth size="small"
            disabled={!categoryId || loadingParents}
            helperText={!categoryId ? 'Спочатку оберіть категорію' : ''}
          >
            {parentProjects.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
            ))}
          </TextField>

          <Divider />

          {/* Едітор */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Опис</Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, minHeight: 200 }}>
              {content !== null ? (
                <ReactEditor onChange={setContent} initialData={content} />
              ) : (
                <ReactEditor onChange={setContent} />
              )}
            </Box>
          </Box>

          <ContributorsList
            contributors={contributors}
            onChange={setContributors}
          />

          <Divider />

          {/* Координати */}
          <Typography variant="subtitle2" fontWeight={600}>Координати</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Широта (lat)" value={lat}
              onChange={(e) => setLat(e.target.value)} size="small" placeholder="48.45262" />
            <TextField fullWidth label="Довгота (lng)" value={lng}
              onChange={(e) => setLng(e.target.value)} size="small" placeholder="28.42077" />
          </Stack>

          <TextField
            fullWidth label="Сайт" value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            size="small" placeholder="https://..."
          />

          {/* Банер */}
          <ImageUploadBox
            previewSrc={imageBase64}
            existingUrl={fullData?.image?.url ?? null}
            onUpload={setImageBase64}
            onRemove={() => setImageBase64(null)}
            inputId="child-project-image"
            label="Банер клубу"
          />
          <FormControlLabel
            control={
              <Switch
                checked={zoom}
                onChange={(e) => setZoom(e.target.checked)}
              />
            }
            label="Zoom"
          />

          <ImageUploadBox
            previewSrc={logoBase64}
            existingUrl={fullData?.logo?.url ?? null}
            onUpload={setLogoBase64}
            onRemove={() => setLogoBase64(null)}
            inputId="child-project-logo"
            label="Лого клубу"
          />

          <Divider />

          {/* Соцмережі */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600}>Соціальні мережі</Typography>
            <Button size="small" startIcon={<IconPlus size={14} />}
              onClick={() => setSocials((p) => [...p, { platform: 'INSTAGRAM', url: '' }])}>
              Додати
            </Button>
          </Stack>

          {socials.map((s, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="center">
              <TextField
                select label="Платформа" value={s.platform}
                onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                sx={{ width: 160, flexShrink: 0 }} size="small"
              >
                {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField
                fullWidth label="Посилання" value={s.url} size="small"
                onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                placeholder="https://..."
              />
              <IconButton size="small" color="error"
                onClick={() => setSocials((p) => p.filter((_, i) => i !== idx))}>
                <IconTrash size={16} />
              </IconButton>
            </Stack>
          ))}

          {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Скасувати</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Збереження...' : isEdit ? 'Зберегти' : 'Створити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}