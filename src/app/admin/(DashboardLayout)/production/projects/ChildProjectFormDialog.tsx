'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, IconButton, Divider, Tabs, Tab,
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import ContributorsList from './ContributorsList';
import { Contributor } from './ContributorCard';
import dynamic from 'next/dynamic';
import { Category, ParentProject, SocialLink } from './ParentProjectFormDialog';
import { Switch, FormControlLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';

const ReactEditor = dynamic(() => import('../../components/editor/ReactEditor'), { ssr: false });

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

const LANGUAGES = [
  { value: 'UK', icon: '/flags/UA.svg', label: 'Ukraine' },
  { value: 'EN', icon: '/flags/GB.svg', label: 'Great Britain' },
  { value: 'PL', icon: '/flags/PL.svg', label: 'Poland' },
  { value: 'LT', icon: '/flags/LT.svg', label: 'Lithuania' },
  { value: 'RO', icon: '/flags/RO.svg', label: 'Romania' },
];

export interface ChildProject {
  id: number;
  title: string;
  title_en?: string | null;
  title_pl?: string | null;
  title_lt?: string | null;
  title_ro?: string | null;
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
    lang: string;
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
  const [lang, setLang]                 = useState<string>(initial?.lang ?? 'UK');
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

  const [langTab, setLangTab]       = useState('UK');
  const [title, setTitle] = useState('');
  const [title_en, setTitle_en]     = useState('');
  const [title_pl, setTitle_pl]     = useState('');
  const [title_lt, setTitle_lt]     = useState('');
  const [title_ro, setTitle_ro]     = useState('');
  const [content_en, setContent_en] = useState<unknown>(null);
  const [content_pl, setContent_pl] = useState<unknown>(null);
  const [content_lt, setContent_lt] = useState<unknown>(null);
  const [content_ro, setContent_ro] = useState<unknown>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [subcategoryInput, setSubcategoryInput] = useState('');
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(initial?.imageId ?? null);
  const [selectedLogoId, setSelectedLogoId] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCategoryId(initial?.categoryId ?? '');
      setSubcategoryId(initial?.subcategoryId ?? '');
      setParentId(initial?.parentId ?? '');
      setContent(fullData?.body ?? initial?.body ?? null);
      setImageBase64(initial?.imageBase64 ?? null);
      setLang(fullData?.lang ?? initial?.lang ?? 'UK');
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
    setTitle(fullData?.subcategory?.name ?? initial?.title ?? '');
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
    setSocials(
      fullData?.socialLinks?.length
        ? fullData.socialLinks.map((s: any) => ({ platform: s.social?.platform ?? s.platform, url: s.url }))
        : [{ platform: 'INSTAGRAM', url: '' }]
    );
    setImageBase64(null);
    setLogoBase64(null);
    setZoom((fullData?.body as any)?.zoom ?? (initial?.body as any)?.zoom ?? false);
    setContributors((fullData?.body as any)?.contributors ?? (initial?.body as any)?.contributors ?? []);
    setError('');
    setImageBase64(null);
    setLogoBase64(null);
    setBannerUrl(null);
    setLogoUrl(null);
    setSelectedBannerId(fullData?.imageId ?? initial?.imageId ?? null);
    setSelectedLogoId(fullData?.logoId ?? null);
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

  const handleCreateSubcategory = async (name: string) => {
    if (!categoryId) return;
    setCreatingSubcategory(true);
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, categoryId: Number(categoryId) }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const created = await res.json();
      console.log('created subcategory:', created);
      setSubcategories((prev) => [...prev, created]);
      setSubcategoryId(created.id);
      setSubcategoryInput(created.name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingSubcategory(false);
    }
  };

  const LANGS = [
    { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
    { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
    { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
    { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
    { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
  ];

  const titleMap: Record<string, { value: string; set: (v: string) => void }> = {
    EN: { value: title_en, set: setTitle_en },
    PL: { value: title_pl, set: setTitle_pl },
    LT: { value: title_lt, set: setTitle_lt },
    RO: { value: title_ro, set: setTitle_ro },
  };

  const bodyMap: Record<string, { value: unknown; set: (v: unknown) => void }> = {
    UK: { value: content,    set: setContent    },
    EN: { value: content_en, set: setContent_en },
    PL: { value: content_pl, set: setContent_pl },
    LT: { value: content_lt, set: setContent_lt },
    RO: { value: content_ro, set: setContent_ro },
  };

  const handleSubmit = async () => {
    if (!title.trim())   { setError("Title is required"); return; }
    if (!categoryId)     { setError('Please select a category'); return; }
    if (!parentId)       { setError('Please select a parent project'); return; }
    if (creatingSubcategory) return;
    if (!subcategoryId || subcategoryId === -1) { setError('Please select a subcategory'); return; }

    // перевірка що підкатегорія не зайнята (лише при створенні)
    if (!isEdit && usedSubcategoryIds.includes(Number(subcategoryId))) {
      setError('This subcategory is already assigned to another child project. Please choose a different one.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // банер
      let imageId: number | null = selectedBannerId ?? initial?.imageId ?? null;
      if (imageBase64 && imageBase64.startsWith('data:')) {
        const blob = await (await fetch(imageBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'banner.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Error uploading banner');
        imageId = (await res.json()).id;
      }

      // логотип
      let logoId: number | null = selectedLogoId ?? fullData?.logoId ?? null;
      if (logoBase64 && logoBase64.startsWith('data:')) {
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
        title_en: title_en || null,
        title_pl: title_pl || null,
        title_lt: title_lt || null,
        title_ro: title_ro || null,
        body_en: content_en ?? { blocks: [] },
        body_pl: content_pl ?? { blocks: [] },
        body_lt: content_lt ?? { blocks: [] },
        body_ro: content_ro ?? { blocks: [] },
        lang,
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
          name: title,
          url: websiteUrl || `https://studio.pangeya.org.ua/public/Mfk/${subcategories.find(s => s.id === Number(subcategoryId))?.slug ?? subcategoryId}`,
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
      <DialogTitle>{isEdit ? 'Edit Project' : 'Create Project'}</DialogTitle>
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
            <Autocomplete
              freeSolo
              options={subcategories}
              getOptionLabel={(o) => typeof o === 'string' ? o : o.name}
              getOptionDisabled={(o) => typeof o !== 'string' && !isEdit && usedSubcategoryIds.includes(o.id)}
              value={subcategories.find((s) => s.id === Number(subcategoryId)) ?? null}
              inputValue={subcategoryInput}
              disabled={!categoryId || loadingSubs || creatingSubcategory}
              onInputChange={(_, val) => setSubcategoryInput(val)}
              onChange={(_, val) => {
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
                  filtered.push({ id: -1, name: `${state.inputValue}`, slug: '', categoryId: Number(categoryId) });
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
                  helperText={!categoryId ? 'Please select a category first' : ''}
                />
              )}
            />

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
              return (
                <Box key={l.code} sx={{ display: langTab === l.code ? 'block' : 'none' }}>
                  <TextField
                    fullWidth size="small" label={`Title (${l.label})`}
                    value={tm.value}
                    onChange={(e) => tm.set(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, minHeight: 200 }}>
                    {(!isEdit || fullData) && (
                      bm.value !== null
                        ? <ReactEditor onChange={bm.set} initialData={bm.value} holderId={`editorjs-${l.code.toLowerCase()}`} />
                        : <ReactEditor onChange={bm.set} holderId={`editorjs-${l.code.toLowerCase()}`} />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <TextField
            select label="Language" value={lang}
            onChange={(e) => setLang(e.target.value)}
            fullWidth size="small"
          >
            {LANGUAGES.map((l) => (
                <MenuItem key={l.value} value={l.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {l.icon && <img src={l.icon} width={24} height={24} alt={l.label} style={{ borderRadius: 2 }} />}
                    <span>{l.label}</span>
                  </Box>
                </MenuItem>
            ))}
          </TextField>

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
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Club Banner</Typography>
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
              {(imageBase64 ?? bannerUrl ?? fullData?.image?.url) ? 'Change Banner' : 'Select Banner'}
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

          {categories.find((c) => c.id === Number(categoryId))?.name === '#CountrysideStudio' && (
            <>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>Club Logo</Typography>
                {(logoBase64 ?? logoUrl ?? fullData?.logo?.url) ? (
                  <Box sx={{ position: 'relative', mb: 1 }}>
                    <Box component="img"
                      src={logoBase64 ?? logoUrl ?? fullData?.logo?.url}
                      sx={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Button size="small" color="error" variant="contained"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => { setLogoBase64(null); setLogoUrl(null); setSelectedLogoId(null); }}>
                      Remove
                    </Button>
                  </Box>
                ) : null}
                <Button variant="outlined" fullWidth size="small" onClick={() => setLogoPickerOpen(true)}>
                  {(logoBase64 ?? logoUrl ?? fullData?.logo?.url) ? 'Change Logo' : 'Select Logo'}
                </Button>
              </Box>

              <MediaPickerDialog
                open={logoPickerOpen}
                onClose={() => setLogoPickerOpen(false)}
                selected={selectedLogoId}
                onSelect={(item: MediaItem) => {
                  setLogoUrl(item.url);
                  setLogoBase64(item.url);
                  setSelectedLogoId(item.id);
                }}
              />

              <FormControlLabel
                control={<Switch checked={zoom} onChange={(e) => setZoom(e.target.checked)} />}
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
        <Button variant="contained" onClick={handleSubmit} disabled={saving || creatingSubcategory}>
          {saving || creatingSubcategory ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}