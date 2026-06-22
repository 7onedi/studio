'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, IconButton, Divider, Tabs, Tab,
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
  body_en: unknown;
  body_pl: unknown;
  body_lt: unknown;
  body_ro: unknown;
  lat: string;
  lng: string;
  websiteUrl: string;
  socialLinks: SocialLink[];
}

const PLATFORMS = ['YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'TWITTER'];

const LANGS = [
  { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
  { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
  { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
  { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
  { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
];

interface Props {
  open: boolean;
  initial?: Partial<ParentProject & ParentProjectFormData>;
  categories: Category[];
  onClose: () => void;
  onSaved: (project: ParentProject) => void;
}

export default function ParentProjectFormDialog({
  open, initial, categories, onClose, onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);

  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [langTab, setLangTab]       = useState('UK');
  const [content, setContent]       = useState<unknown>(null);
  const [content_en, setContent_en] = useState<unknown>(null);
  const [content_pl, setContent_pl] = useState<unknown>(null);
  const [content_lt, setContent_lt] = useState<unknown>(null);
  const [content_ro, setContent_ro] = useState<unknown>(null);
  const [fullData, setFullData]     = useState<any>(null);
  const [lat, setLat]               = useState('');
  const [zoom, setZoom]             = useState<number>(14);
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
      setContent_en(initial?.body_en ?? null);
      setContent_pl(initial?.body_pl ?? null);
      setContent_lt(initial?.body_lt ?? null);
      setContent_ro(initial?.body_ro ?? null);
      setLat(initial?.lat ?? '');
      setLng(initial?.lng ?? '');
      setZoom((initial?.body as any)?.zoom ?? 14);
      setWebsiteUrl(initial?.websiteUrl ?? '');
      setSocials(initial?.socialLinks?.length ? initial.socialLinks : [{ platform: 'INSTAGRAM', url: '' }]);
      setLangTab('UK');
      setError('');
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open || !initial?.id) { setFullData(null); return; }
    fetch(`/api/studioprojects/${initial.id}`)
      .then((r) => r.json())
      .then((d) => setFullData(d))
      .catch(console.error);
  }, [open, initial?.id]);

  useEffect(() => {
    if (!open) return;
    setCategoryId(fullData?.categoryId ?? initial?.categoryId ?? '');
    setContent(fullData?.body ?? initial?.body ?? null);
    setContent_en(fullData?.body_en ?? initial?.body_en ?? null);
    setContent_pl(fullData?.body_pl ?? initial?.body_pl ?? null);
    setContent_lt(fullData?.body_lt ?? initial?.body_lt ?? null);
    setContent_ro(fullData?.body_ro ?? initial?.body_ro ?? null);
    setLat(String(fullData?.location?.coordinates?.lat ?? initial?.lat ?? ''));
    setLng(String(fullData?.location?.coordinates?.lng ?? initial?.lng ?? ''));
    setZoom((fullData?.location?.coordinates as any)?.zoom ?? (initial?.body as any)?.zoom ?? 14);
    setWebsiteUrl(fullData?.location?.url ?? initial?.websiteUrl ?? '');
    setSocials(
      fullData?.socialLinks?.length
        ? fullData.socialLinks.map((s: any) => ({ platform: s.platform, url: s.url }))
        : [{ platform: 'INSTAGRAM', url: '' }]
    );
    setError('');
  }, [open, fullData]);

  const handleClose = () => { setFullData(null); onClose(); };

  const updateSocial = (idx: number, field: keyof SocialLink, val: string) =>
    setSocials((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!categoryId)   { setError('Please select a category'); return; }
    if (websiteUrl && !websiteUrl.startsWith('http')) {
      setError('Website must be a valid URL (starting with https://)');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/studioprojects/${initial!.id}` : '/api/studioprojects';

      const payload = {
        title,
        categoryId: Number(categoryId),
        body:    content    ?? { blocks: [] },
        body_en: content_en ?? { blocks: [] },
        body_pl: content_pl ?? { blocks: [] },
        body_lt: content_lt ?? { blocks: [] },
        body_ro: content_ro ?? { blocks: [] },
        locationData: {
          name: title,
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

  const bodyMap: Record<string, { value: unknown; set: (v: unknown) => void }> = {
    UK: { value: content,    set: setContent    },
    EN: { value: content_en, set: setContent_en },
    PL: { value: content_pl, set: setContent_pl },
    LT: { value: content_lt, set: setContent_lt },
    RO: { value: content_ro, set: setContent_ro },
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Project' : 'New Parent Project'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          <TextField
            select label="Category *" value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            fullWidth size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <Divider />

          {/* Мовні таби */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Description</Typography>
            <Tabs
              value={langTab}
              onChange={(_, v) => setLangTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              {LANGS.map((l) => (
                <Tab
                  key={l.code}
                  value={l.code}
                  label={
                    <Box display="flex" alignItems="center" gap={0.75}>
                      <img src={l.icon} width={20} height={20} alt={l.label} style={{ borderRadius: 2 }} />
                      {l.label}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {LANGS.map((l) => {
              const { value, set } = bodyMap[l.code];
              if (langTab !== l.code) return null;
              return (
                <Box
                  key={l.code}
                  sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, minHeight: 200 }}
                >
                  <ReactEditor
                    key={l.code}
                    onChange={set}
                    initialData={value ?? undefined}
                    holderId={`editorjs-${l.code.toLowerCase()}`}
                  />
                </Box>
              );
            })}
          </Box>

          <Divider />

          {/* Координати */}
          <Typography variant="subtitle2" fontWeight={600}>Coordinates</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="(lat)" value={lat}
              onChange={(e) => setLat(e.target.value)} size="small" placeholder="48.45262" />
            <TextField fullWidth label="(lng)" value={lng}
              onChange={(e) => setLng(e.target.value)} size="small" placeholder="28.42077" />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Zoom</Typography>
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