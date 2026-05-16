'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, IconButton, Divider,
} from '@mui/material';
import { IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const ReactEditor = dynamic(() => import('../../components/editor/ReactEditor'), { ssr: false });

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ParentProject {
  id: number;
  title: string;
  categoryId: number;
  category?: Category;
  published?: boolean;
}

export interface ParentProjectFormData {
  title: string;
  categoryId: number | '';
  body: unknown;
  lat: string;
  lng: string;
  websiteUrl: string;
  socialLinks: SocialLink[];
}

const PLATFORMS = ['YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'TWITTER'];

interface Props {
  open: boolean;
  initial?: Partial<ParentProject & ParentProjectFormData>;
  categories: Category[];
  onClose: () => void;
  onSaved: (project: ParentProject) => void;
}

function ImageUploadBox({
  previewSrc, existingUrl, onUpload, onRemove,
}: {
  previewSrc: string | null;
  existingUrl?: string | null; 
  onUpload: (base64: string) => void;
  onRemove: () => void;
}) {
  const src = previewSrc ?? existingUrl ?? null;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>Банер</Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: previewSrc ? 'primary.main' : 'grey.300',
          borderRadius: 2, p: 2, textAlign: 'center',
          cursor: 'pointer', position: 'relative',
          minHeight: 120, display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
        onClick={() => document.getElementById('parent-project-image')?.click()}
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
      <input id="parent-project-image" type="file" accept="image/*"
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

export default function ParentProjectFormDialog({
  open, initial, categories, onClose, onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);

  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [content, setContent]       = useState<unknown>(null);
  const [fullData, setFullData]     = useState<any>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [lat, setLat]               = useState('');
  const [zoom, setZoom] = useState<number>(14);
  const [lng, setLng]               = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  const [socials, setSocials]       = useState<SocialLink[]>([{ platform: 'INSTAGRAM', url: '' }]);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));
  const title = selectedCategory?.name ?? '';

  useEffect(() => {
    if (open) {
      setCategoryId(initial?.categoryId ?? '');
      setContent(initial?.body ?? null);
      setLat(initial?.lat ?? '');
      setLng(initial?.lng ?? '');
      setZoom((initial?.body as any)?.zoom ?? 14);
      setWebsiteUrl(initial?.websiteUrl ?? '');
      setSocials(initial?.socialLinks?.length ? initial.socialLinks : [{ platform: 'INSTAGRAM', url: '' }]);
      setError('');
    }
  }, [open, initial]);

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

    useEffect(() => {
    if (!open) return;
    setCategoryId(fullData?.categoryId ?? initial?.categoryId ?? '');
    setContent(fullData?.body ?? initial?.body ?? null);
    setLat(String(fullData?.location?.coordinates?.lat ?? initial?.lat ?? ''));
    setLng(String(fullData?.location?.coordinates?.lng ?? initial?.lng ?? ''));
    setZoom((fullData?.location?.coordinates as any)?.zoom ?? (initial?.body as any)?.zoom ?? 14);
    setWebsiteUrl(fullData?.location?.url ?? initial?.websiteUrl ?? '');
    setSocials(
        fullData?.socialLinks?.length
        ? fullData.socialLinks.map((s: any) => ({ platform: s.platform, url: s.url }))
        : [{ platform: 'INSTAGRAM', url: '' }]
    );
    setImageRemoved(false);
    setError('');
    }, [open, fullData]);

    const handleClose = () => {
      setFullData(null);
      onClose();
    };

  const updateSocial = (idx: number, field: keyof SocialLink, val: string) =>
    setSocials((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Назва обов'язкова"); return; }
    if (!categoryId)   { setError('Оберіть категорію'); return; }
    if (websiteUrl && !websiteUrl.startsWith('http')) {
        setError('Сайт має бути валідним URL (починатись з https://)');
        return;
    }
    setSaving(true);
    setError('');
    try {

      // 2. Збереження проекту
      const url = isEdit
        ? `/api/studioprojects/${initial!.id}`
        : '/api/studioprojects';

      const payload = {
        title,
        categoryId: Number(categoryId),
        body: content ?? { blocks: [] },
        locationData: {
          name:        title,
          url: websiteUrl || `https://studio.pangeya.org.ua/${selectedCategory?.slug}-${Date.now()}`,
          coordinates: { lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0, zoom },
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
      <DialogTitle>{isEdit ? 'Редагувати проект' : 'Новий батьківський проект'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          <TextField
            select label="Категорія *" value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            fullWidth size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
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

          <Divider />

          {/* Координати */}
          <Typography variant="subtitle2" fontWeight={600}>Координати</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Широта (lat)" value={lat}
              onChange={(e) => setLat(e.target.value)} size="small" placeholder="48.45262" />
            <TextField fullWidth label="Довгота (lng)" value={lng}
              onChange={(e) => setLng(e.target.value)} size="small" placeholder="28.42077" />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Зум</Typography>
            <IconButton size="small" onClick={() => setZoom((z) => Math.max(1, z - 1))}>
              <IconMinus size={14} />
            </IconButton>
            <TextField
              value={zoom}
              onChange={(e) => setZoom(Math.min(20, Math.max(1, Number(e.target.value))))}
              size="small"
              slotProps={{ htmlInput: { min: 1, max: 20, style: { textAlign: 'center', width: 40 } } }}
            />
            <IconButton size="small" onClick={() => setZoom((z) => Math.min(20, z + 1))}>
              <IconPlus size={14} />
            </IconButton>
          </Stack>

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