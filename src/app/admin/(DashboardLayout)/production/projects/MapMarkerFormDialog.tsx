'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, IconButton, Divider, Tabs, Tab, CircularProgress
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { Category, ParentProject, SocialLink } from './ParentProjectFormDialog';
import Autocomplete from '@mui/material/Autocomplete';
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';
import { FieldHelp } from '../../components/shared/FieldHelp';

const PartnerDescriptionEditor = dynamic(
  () => import('../../components/editor/PartnerDescriptionEditor'),
  { ssr: false }
);

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

const MARKER_TYPES = [
  { value: 'IMAGEMAPPING', label: 'Imagemapping' },
  { value: 'HISTORICAL', label: 'Historical' },
  { value: 'NATURE', label: 'Nature' },
] as const;

type MarkerType = typeof MARKER_TYPES[number]['value'];

const LANGS = [
  { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
  { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
  { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
  { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
  { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
];

export interface MapMarkerProject {
  id: number;
  title: string;
  title_en?: string | null;
  title_pl?: string | null;
  title_lt?: string | null;
  title_ro?: string | null;
  categoryId: number;
  subcategoryId?: number;
  parentId?: number;
  markerType?: MarkerType | null;
  published?: boolean;
}

interface Props {
  open: boolean;
  initial?: Partial<MapMarkerProject & {
    body: unknown;
    imageBase64?: string | null;
    imageId?: number | null;
    websiteUrl?: string | null;
    lat: string;
    lng: string;
  }>;
  imagemappingCategoryId: number;
  parentCandidates: { id: number; title: string }[];
  usedSubcategoryIds?: number[];
  onClose: () => void;
  onSaved: (project: MapMarkerProject) => void;
}

export default function MapMarkerFormDialog({
  open, initial, imagemappingCategoryId, parentCandidates, usedSubcategoryIds = [], onClose, onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);

  const [markerType, setMarkerType] = useState<MarkerType>(initial?.markerType ?? 'IMAGEMAPPING');
  const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
  const [parentId, setParentId] = useState<number | ''>('');
  const [content, setContent] = useState<unknown>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [langTab, setLangTab] = useState('EN');
  const [title, setTitle] = useState('');
  const [title_en, setTitle_en] = useState('');
  const [title_pl, setTitle_pl] = useState('');
  const [title_lt, setTitle_lt] = useState('');
  const [title_ro, setTitle_ro] = useState('');
  const [content_en, setContent_en] = useState<unknown>(null);
  const [content_pl, setContent_pl] = useState<unknown>(null);
  const [content_lt, setContent_lt] = useState<unknown>(null);
  const [content_ro, setContent_ro] = useState<unknown>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [subcategoryInput, setSubcategoryInput] = useState('');
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(initial?.imageId ?? null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!markerType) next.markerType = "Please select a marker type";
    if (!title_en.trim()) next.title_en = "English title is required";
    else if (title_en.trim().length < 3) next.title_en = "Minimum 3 characters";
    else if (title_en.trim().length > 200) next.title_en = "Maximum 200 characters";

    if (!parentId) next.parentId = "Please select a parent project";
    if (!subcategoryId || subcategoryId === -1) next.subcategoryId = "Please select or create a subcategory";
    else if (!isEdit && usedSubcategoryIds.includes(Number(subcategoryId))) {
        next.subcategoryId = "This subcategory is already assigned to another project";
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!lat.trim() || isNaN(latNum) || latNum < -90 || latNum > 90) {
        next.lat = "Latitude must be between -90 and 90";
    }
    if (!lng.trim() || isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        next.lng = "Longitude must be between -180 and 180";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  useEffect(() => {
    if (open) {
      setSubcategoryId(initial?.subcategoryId ?? '');
      setParentId(initial?.parentId ?? '');
      setMarkerType(initial?.markerType ?? 'IMAGEMAPPING');
      setContent(fullData?.body ?? initial?.body ?? null);
      setImageBase64(initial?.imageBase64 ?? null);
      setLat(initial?.lat ?? '');
      setLng(initial?.lng ?? '');
      setWebsiteUrl(initial?.websiteUrl ?? '');
      setDataReady(!initial?.id);
      setError('');
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open || !initial?.id) { setFullData(null); return; }
    setDataReady(false);
    fetch(`/api/studioprojects/${initial.id}`)
      .then((r) => r.json())
      .then((d) => setFullData(d))
      .catch(console.error);
  }, [open, initial?.id]);

  useEffect(() => {
    if (!open) return;
    setSubcategoryId(fullData?.subcategoryId ?? initial?.subcategoryId ?? '');
    setMarkerType(fullData?.markerType ?? initial?.markerType ?? 'IMAGEMAPPING');
    setTitle(fullData?.title ?? initial?.title ?? '');
    setTitle_en(fullData?.title_en ?? initial?.title_en ?? '');
    setTitle_pl(fullData?.title_pl ?? initial?.title_pl ?? '');
    setTitle_lt(fullData?.title_lt ?? initial?.title_lt ?? '');
    setTitle_ro(fullData?.title_ro ?? initial?.title_ro ?? '');
    setContent_en(fullData?.body_en ?? null);
    setContent_pl(fullData?.body_pl ?? null);
    setContent_lt(fullData?.body_lt ?? null);
    setContent_ro(fullData?.body_ro ?? null);
    setSubcategoryInput(fullData?.subcategory?.name ?? initial?.title ?? '');
    setParentId(fullData?.parentId ?? initial?.parentId ?? '');
    setContent(fullData?.body ?? initial?.body ?? null);
    setLat(String(fullData?.location?.coordinates?.lat ?? initial?.lat ?? ''));
    setLng(String(fullData?.location?.coordinates?.lng ?? initial?.lng ?? ''));
    setWebsiteUrl(fullData?.location?.url ?? initial?.websiteUrl ?? '');
    setImageBase64(null);
    setBannerUrl(null);
    setSelectedBannerId(fullData?.imageId ?? initial?.imageId ?? null);
    setError('');
    if (fullData || !initial?.id) setDataReady(true);
  }, [open, fullData]);

  // підкатегорії по фіксованій категорії Imagemapping
  useEffect(() => {
    if (!open) return;
    setLoadingSubs(true);
    fetch(`/api/subcategories/search?categoryId=${imagemappingCategoryId}&limit=100`)
      .then((r) => r.json())
      .then((d) => setSubcategories(Array.isArray(d.data) ? d.data : []))
      .catch(console.error)
      .finally(() => setLoadingSubs(false));
  }, [open, imagemappingCategoryId]);

  const handleClose = () => {
    setFullData(null);
    onClose();
  };

  const handleCreateSubcategory = async (name: string) => {
    setCreatingSubcategory(true);
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, categoryId: imagemappingCategoryId }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const created = await res.json();
      setSubcategories((prev) => [...prev, created]);
      setSubcategoryId(created.id);
      setSubcategoryInput(created.name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingSubcategory(false);
    }
  };

  const titleMap: Record<string, { value: string; set: (v: string) => void }> = {
    EN: { value: title_en, set: setTitle_en },
    PL: { value: title_pl, set: setTitle_pl },
    LT: { value: title_lt, set: setTitle_lt },
    RO: { value: title_ro, set: setTitle_ro },
  };

  const bodyMap: Record<string, { value: unknown; set: (v: unknown) => void }> = {
    UK: { value: content, set: setContent },
    EN: { value: content_en, set: setContent_en },
    PL: { value: content_pl, set: setContent_pl },
    LT: { value: content_lt, set: setContent_lt },
    RO: { value: content_ro, set: setContent_ro },
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (creatingSubcategory) return;

    setSaving(true);
    setError('');

    try {
      let imageId: number | null = selectedBannerId ?? initial?.imageId ?? null;
      if (imageBase64 && imageBase64.startsWith('data:')) {
        const blob = await (await fetch(imageBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'marker.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Error uploading image');
        imageId = (await res.json()).id;
      }

      const url = isEdit ? `/api/studioprojects/${initial!.id}` : '/api/studioprojects';

      const payload = {
        title,
        title_en: title_en || null,
        title_pl: title_pl || null,
        title_lt: title_lt || null,
        title_ro: title_ro || null,
        body_en: content_en ?? { blocks: [] },
        body_pl: content_pl ?? { blocks: [] },
        body_lt: content_lt ?? { blocks: [] },
        body_ro: content_ro ?? { blocks: [] },
        categoryId: imagemappingCategoryId,
        subcategoryId: Number(subcategoryId),
        parentId: Number(parentId),
        markerType,
        body: { ...(content as any ?? { blocks: [] }) },
        ...(imageId && { imageId }),
        locationData: {
          name: title_en,
          url: websiteUrl.trim() || null,
          coordinates: {
            lat: parseFloat(lat) || 0,
            lng: parseFloat(lng) || 0,
          },
        },
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 3 }}>
        {isEdit ? 'Edit Marker' : 'Create Marker'}
        <FieldHelp>Fields marked with an asterisk (*) are required.</FieldHelp>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          <TextField
            select label="Marker Type *" value={markerType}
            onChange={(e) => {
                setMarkerType(e.target.value as MarkerType);
                setErrors(p => ({ ...p, markerType: '' }));
            }}
            fullWidth size="small"
            error={!!errors.markerType}
            helperText={errors.markerType || ' '}
            >
            {MARKER_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </TextField>

          <Autocomplete
            freeSolo
            options={subcategories}
            getOptionLabel={(o) => typeof o === 'string' ? o : o.name}
            getOptionDisabled={(o) => typeof o !== 'string' && !isEdit && usedSubcategoryIds.includes(o.id)}
            value={subcategories.find((s) => s.id === Number(subcategoryId)) ?? null}
            inputValue={subcategoryInput}
            disabled={loadingSubs || creatingSubcategory}
            onInputChange={(_, val) => setSubcategoryInput(val)}
            onChange={(_, val) => {
                setErrors(p => ({ ...p, subcategoryId: '' }));
                if (!val) { setSubcategoryId(''); setTitle(''); return; }
                if (typeof val === 'string') {
                handleCreateSubcategory(val.trim());
                } else if (val.id !== -1) {
                setSubcategoryId(val.id);
                setSubcategoryInput(val.name);
                setTitle(val.name);
                } else {
                handleCreateSubcategory(val.name.trim());
                }
            }}
            filterOptions={(options, state) => {
                const filtered = options.filter((o) =>
                o.name.toLowerCase().includes(state.inputValue.toLowerCase())
                );
                if (state.inputValue.trim() && !options.find((o) => o.name.toLowerCase() === state.inputValue.toLowerCase())) {
                filtered.push({ id: -1, name: state.inputValue, slug: '', categoryId: imagemappingCategoryId });
                }
                return filtered;
            }}
            renderOption={(props, option) => (
                <MenuItem {...props} key={option.id} disabled={!isEdit && usedSubcategoryIds.includes(option.id)}>
                {option.id === -1
                    ? <Typography color="primary">{option.name}</Typography>
                    : <>
                        {option.name}
                        {!isEdit && usedSubcategoryIds.includes(option.id) ? ' (already used)' : ''}
                    </>
                }
                </MenuItem>
            )}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Subcategory *"
                size="small"
                error={!!errors.subcategoryId}
                helperText={errors.subcategoryId || ' '}
                />
            )}
            />

          <TextField
            select label="Parent Project *" value={parentId}
            onChange={(e) => {
                setParentId(Number(e.target.value));
                setErrors(p => ({ ...p, parentId: '' }));
            }}
            fullWidth size="small"
            error={!!errors.parentId}
            helperText={errors.parentId || 'Only child projects under the Imagemapping category are shown'}
            >
              {parentCandidates.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
            ))}
          </TextField>

          <Divider />

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
                <Tab key={l.code} value={l.code} label={
                  <Box display="flex" alignItems="center" gap={0.75}>
                    <img src={l.icon} width={20} height={20} alt={l.label} style={{ borderRadius: 2 }} />
                    {l.label}
                  </Box>
                } />
              ))}
            </Tabs>

            {LANGS.map((l) => {
              const tm = l.code === 'UK' ? { value: title, set: setTitle } : titleMap[l.code];
              const bm = bodyMap[l.code];
              if (langTab !== l.code) return null;
              return (
                <Box key={l.code}>
                  <TextField
                    fullWidth size="small" label={`Title (${l.label})`}
                    value={tm.value}
                    onChange={(e) => {
                        tm.set(e.target.value);
                        if (l.code === 'EN') setErrors(p => ({ ...p, title_en: '' }));
                    }}
                    error={l.code === 'EN' && !!errors.title_en}
                    helperText={l.code === 'EN' ? (errors.title_en || ' ') : ' '}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, minHeight: 200 }}>
                    {!dataReady ? (
                    <Box display="flex" alignItems="center" justifyContent="center" minHeight={160}>
                        <CircularProgress size={24} />
                    </Box>
                    ) : (
                    bm.value !== null
                        ? <PartnerDescriptionEditor key={l.code} onChange={bm.set} initialData={bm.value} holderId={`marker-editorjs-${l.code.toLowerCase()}`} minimal />
                        : <PartnerDescriptionEditor key={l.code} onChange={bm.set} holderId={`marker-editorjs-${l.code.toLowerCase()}`} minimal />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Divider />

          <Typography variant="subtitle2" fontWeight={600}>Coordinates</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Latitude (lat) *" value={lat}
                onChange={(e) => { setLat(e.target.value); setErrors(p => ({ ...p, lat: '' })); }}
                size="small" placeholder="48.45262"
                error={!!errors.lat}
                helperText={errors.lat || ' '}
            />
            <TextField fullWidth label="Longitude (lng) *" value={lng}
                onChange={(e) => { setLng(e.target.value); setErrors(p => ({ ...p, lng: '' })); }}
                size="small" placeholder="28.42077"
                error={!!errors.lng}
                helperText={errors.lng || ' '}
            />
            </Stack>

            <TextField
                fullWidth label="Website (optional)" value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                size="small" placeholder="https://..."
            />

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Marker Image</Typography>
            {(imageBase64 ?? bannerUrl ?? fullData?.image?.url) ? (
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box component="img"
                  src={imageBase64 ?? bannerUrl ?? fullData?.image?.url}
                  sx={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 2 }}
                />
                <Button size="small" color="error" variant="contained"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => { setImageBase64(null); setBannerUrl(null); setSelectedBannerId(null); }}>
                  Remove
                </Button>
              </Box>
            ) : null}
            <Button variant="outlined" fullWidth size="small" onClick={() => setBannerPickerOpen(true)}>
              {(imageBase64 ?? bannerUrl ?? fullData?.image?.url) ? 'Change Image' : 'Select Image'}
            </Button>
          </Box>

          <MediaPickerDialog
            open={bannerPickerOpen}
            onClose={() => setBannerPickerOpen(false)}
            selected={selectedBannerId}
            onSelect={(item: MediaItem) => {
              setBannerUrl(item.url);
              setImageBase64(item.url);
              setSelectedBannerId(item.id);
            }}
          />

          {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving || creatingSubcategory}>
          {saving || creatingSubcategory ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}