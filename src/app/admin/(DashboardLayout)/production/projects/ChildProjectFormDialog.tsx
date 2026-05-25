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
              Remove
            </Button>
          </>
        ) : (
          <Typography color="text.secondary" fontSize={14}>
            Click to upload {label?.toLowerCase() ?? 'image'}
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
      setZoom((fullData?.body as any)?.zoom ?? (initial?.body as any)?.zoom ?? false);
      setSocials(initial?.socialLinks?.length
        ? initial.socialLinks
        : [{ platform: 'INSTAGRAM', url: '' }]);
      setError('');
    }
  }, [open, initial]);

// завантажуємо повні дані при відкритті форми редагування
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
  setContributors((fullData?.body as any)?.contributors ?? (initial?.body as any)?.contributors ?? []); // ← додати
  setError('');
}, [open, fullData]);

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
    fetch(`/api/studioprojects/search?categoryId=${categoryId}&limit=100&hasParent=false`)
      .then((r) => r.json())
      .then((d) => {
        setParentProjects(Array.isArray(d.data) ? d.data : []);
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
    if (!title.trim())   { setError("Title is required"); return; }
    if (!categoryId)     { setError('Please select a category'); return; }
    if (!subcategoryId)  { setError('Please select a subcategory'); return; }
    if (!parentId)       { setError('Please select a parent project'); return; }

    // перевірка що підкатегорія не зайнята (лише при створенні)
    if (!isEdit && usedSubcategoryIds.includes(Number(subcategoryId))) {
      setError('This subcategory is already assigned to another child project. Please choose a different one.');
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
        if (!res.ok) throw new Error('Error uploading banner');
        imageId = (await res.json()).id;
      }

      let logoId: number | null = fullData?.logoId ?? null;
      if (logoBase64) {
        const blob = await (await fetch(logoBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'logo.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Error uploading logo');
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
          url: websiteUrl || `https://studio.pangeya.org.ua/public/Mfk/${selectedSub?.slug ?? subcategoryId}`,
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
        throw new Error(json?.message || `Error ${res.status}`);
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
      <DialogTitle>{isEdit ? 'Edit Child Project' : 'Create Child Project'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          {/* Категорія */}
          <TextField
            select label="Category *" value={categoryId}
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
            select label="Subcategory *" value={subcategoryId}
            onChange={(e) => setSubcategoryId(Number(e.target.value))}
            fullWidth size="small"
            disabled={!categoryId || loadingSubs}
            helperText={!categoryId ? 'Please select a category first' : ''}
          >
            {subcategories.map((s) => (
              <MenuItem
                key={s.id}
                value={s.id}
                disabled={!isEdit && usedSubcategoryIds.includes(s.id)}
              >
                {s.name}
                {!isEdit && usedSubcategoryIds.includes(s.id) ? ' (already used)' : ''}
              </MenuItem>
            ))}
          </TextField>

          {/* Батьківський проект */}
          <TextField
            select label="Parent Project *" value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
            fullWidth size="small"
            disabled={!categoryId || loadingParents}
            helperText={!categoryId ? 'Please select a category first' : ''}
          >
            {parentProjects.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
            ))}
          </TextField>

          <Divider />

          {/* Едітор */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Description</Typography>
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
          <Typography variant="subtitle2" fontWeight={600}>Coordinates</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Latitude (lat)" value={lat}
              onChange={(e) => setLat(e.target.value)} size="small" placeholder="48.45262" />
            <TextField fullWidth label="Longitude (lng)" value={lng}
              onChange={(e) => setLng(e.target.value)} size="small" placeholder="28.42077" />
          </Stack>

          <TextField
            fullWidth label="Website" value={websiteUrl}
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
            label="Club Banner"
          />

            {categories.find((c) => c.id === Number(categoryId))?.name === '#CountrysideStudio' && (
              <>
                <ImageUploadBox
                  previewSrc={logoBase64}
                  existingUrl={fullData?.logo?.url ?? null}
                  onUpload={setLogoBase64}
                  onRemove={() => setLogoBase64(null)}
                  inputId="child-project-logo"
                  label="Club Logo"
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
              </>
            )}

          <Divider />

          {/* Соцмережі */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600}>Social Media</Typography>
            <Button size="small" startIcon={<IconPlus size={14} />}
              onClick={() => setSocials((p) => [...p, { platform: 'INSTAGRAM', url: '' }])}>
              Add
            </Button>
          </Stack>

          {socials.map((s, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="center">
              <TextField
                select label="Platform" value={s.platform}
                onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                sx={{ width: 160, flexShrink: 0 }} size="small"
              >
                {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField
                fullWidth label="Link" value={s.url} size="small"
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
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}