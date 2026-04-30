'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, Container, TextField, Typography,
  IconButton, Stack, Divider, Chip,
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const ReactEditor = dynamic(() => import('../editor/ReactEditor'), { ssr: false });

// ---------------------------------------------------------------------------
// Типи
// ---------------------------------------------------------------------------

export interface SocialIcon {
  title: string;
  link: string;
}

export interface YfcFormData {
  // основні поля subcategory
  name: string;           // назва клубу (title у popupContent)
  categoryId: number;     // завжди CountrysideStudio

  // координати
  lat: string;
  lng: string;

  // popupContent
  body: unknown;  // масив параграфів (HTML allowed)
  // imageUrl: string;       // банер (base64 або url)
  imageBase64?: string | null;
  linkUrl: string;        // посилання на публічну сторінку
  // logoUrl: string;        // лого
  websiteUrl: string;
  logoBase64?: string | null;
  gradient: string;
  zoom: boolean;
  iconNames: SocialIcon[];
}

interface YfcFormProps {
  
  initialData?: Partial<YfcFormData>;
  categoryId: number;
  onSave: (data: YfcFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  successMessage?: string;
  submitLabel?: string;
  title?: string;
  onCancel?: () => void;
}

// ---------------------------------------------------------------------------
// Допоміжні компоненти
// ---------------------------------------------------------------------------

const GRADIENT_OPTIONS = [
  { value: 'bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent', label: 'Синій (знизу)' },
  { value: 'bg-gradient-to-t from-main-red/100 via-main-red/45 to-transparent',   label: 'Червоний (знизу)' },
  { value: 'bg-gradient-to-t from-black/80 via-black/30 to-transparent',           label: 'Чорний (знизу)' },
  { value: 'none', label: 'Без градієнту' },
];

const SOCIAL_TITLES = ['instagram', 'facebook', 'tiktok', 'youtube', 'website'];

function ImageUploadBox({
  label,
  previewSrc,
  onUpload,
  onRemove,
  inputId,
}: {
  label: string;
  previewSrc: string | null;
  onUpload: (base64: string) => void;
  onRemove: () => void;
  inputId: string;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" mb={1}>{label}</Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: previewSrc ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {previewSrc ? (
          <>
            <Box
              component="img"
              src={previewSrc}
              sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1, display: 'block' }}
            />
            <Button
              size="small"
              color="error"
              variant="contained"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
            >
              Видалити
            </Button>
          </>
        ) : (
          <Typography color="text.secondary" fontSize={14}>
            Натисніть щоб завантажити
          </Typography>
        )}
      </Box>
      <input
        id={inputId}
        type="file"
        accept="image/*"
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

// ---------------------------------------------------------------------------
// Основна форма
// ---------------------------------------------------------------------------

export default function YfcForm({
  initialData,
  categoryId,
  onSave,
  loading,
  error,
  success,
  successMessage = 'Збережено!',
  submitLabel = 'Зберегти',
  title = 'YFC клуб',
  onCancel,
}: YfcFormProps) {
  const [name, setName]           = useState(initialData?.name ?? '');
  const [lat, setLat]             = useState(initialData?.lat ?? '');
  const [lng, setLng]             = useState(initialData?.lng ?? '');
  const [gradient, setGradient]   = useState(initialData?.gradient ?? GRADIENT_OPTIONS[0].value);
  const [zoom, setZoom]           = useState(initialData?.zoom ?? false);
  const [linkUrl, setLinkUrl]     = useState(initialData?.linkUrl ?? '');
  // const [logoUrl, setLogoUrl]     = useState(initialData?.logoUrl ?? '');
  // const [imageUrl, setImageUrl]   = useState(initialData?.imageUrl ?? '');
const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl ?? '');
  // банер і лого — base64 для превʼю / завантаження
  const [imageBase64, setImageBase64] = useState<string | null>(initialData?.imageBase64 ?? null);
  const [logoBase64, setLogoBase64]   = useState<string | null>(initialData?.logoBase64 ?? null);

  const [content, setContent] = useState<unknown>(initialData?.body ?? null);
const [uploadedMedia, setUploadedMedia] = useState<{ id: number; url: string }[]>([]);

  // соцмережі
  const [socials, setSocials] = useState<SocialIcon[]>(
    initialData?.iconNames?.length ? initialData.iconNames : [{ title: 'instagram', link: '' }],
  );

  // --- соцмережі ---
  const updateSocial = (idx: number, field: keyof SocialIcon, val: string) =>
    setSocials((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));

  const addSocial = () => setSocials((prev) => [...prev, { title: 'instagram', link: '' }]);

  const removeSocial = (idx: number) =>
    setSocials((prev) => prev.filter((_, i) => i !== idx));

  // --- сабміт ---
  const handleSubmit = () => {
    onSave({
      name,
      categoryId,
      lat,
      lng,
      body: content ?? { blocks: [] },
      // imageUrl,
      imageBase64,
      linkUrl,
      // logoUrl,
      websiteUrl,
      logoBase64,
      gradient,
      zoom,
      iconNames: socials.filter((s) => s.link.trim()),
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">{title}</Typography>
        {onCancel && <Button variant="text" onClick={onCancel}>← Назад</Button>}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>

        {/* ── Основний контент ── */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>

          <TextField
            fullWidth label="Назва клубу *" value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* <TextField
            fullWidth label="Slug *" value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText="Тільки латинські літери, цифри, дефіс. Наприклад: YFC-Stina"
            sx={{ mb: 3 }}
          /> */}
          
          {/* Координати */}
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Координати на карті
          </Typography>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              fullWidth label="Широта (lat) *" value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="48.45262"
            />
            <TextField
              fullWidth label="Довгота (lng) *" value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="28.42077"
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Опис</Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, minHeight: 300 }}>
              {content !== null ? (
                <ReactEditor
                  onChange={setContent}
                  initialData={content}
                  onImageUpload={(id: number, url: string) =>
                    setUploadedMedia((prev) => [...prev, { id, url }])
                  }
                />
              ) : (
                <ReactEditor onChange={setContent} />
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Соціальні мережі */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2" fontWeight={600}>Соціальні мережі</Typography>
              <Button size="small" startIcon={<IconPlus size={14} />} onClick={addSocial}>
                Додати
              </Button>
            </Stack>
            <Stack spacing={2}>
              {socials.map((s, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                  <TextField
                    select
                    SelectProps={{ native: true }}
                    label="Платформа"
                    value={s.title}
                    onChange={(e) => updateSocial(idx, 'title', e.target.value)}
                    sx={{ width: 160, flexShrink: 0 }}
                    size="small"
                  >
                    {SOCIAL_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </TextField>
                  <TextField
                    fullWidth label="Посилання" value={s.link} size="small"
                    onChange={(e) => updateSocial(idx, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                  <IconButton size="small" color="error" onClick={() => removeSocial(idx)}>
                    <IconTrash size={16} />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Кнопки */}
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" size="large" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Збереження...' : submitLabel}
            </Button>
            {onCancel && (
              <Button variant="outlined" size="large" onClick={onCancel}>Скасувати</Button>
            )}
          </Stack>
        </Box>

        {/* ── Бічна колонка ── */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>

          {/* Банер */}
          <ImageUploadBox
            label="Банер клубу"
            previewSrc={imageBase64}
            onUpload={setImageBase64}
            onRemove={() => setImageBase64(null)}
            inputId="yfc-image-upload"
          />
          {/* <TextField
            fullWidth label="URL банера (якщо без завантаження)" value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            size="small" sx={{ mb: 3 }}
            placeholder="/mfk/mfkBaner/mfkBaner1.webp"
          /> */}

          {/* Лого */}
          <ImageUploadBox
            label="Лого клубу"
            previewSrc={logoBase64}
            onUpload={setLogoBase64}
            onRemove={() => setLogoBase64(null)}
            inputId="yfc-logo-upload"
          />
          {/* <TextField
            fullWidth label="URL лого (якщо без завантаження)" value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            size="small" sx={{ mb: 3 }}
            placeholder="/mfk/mfkLogo/mfkLogo1.png"
          /> */}

          {/* <TextField
            fullWidth label="Посилання на публічну сторінку" value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            size="small" sx={{ mb: 3 }}
            placeholder="/public/Mfk/YFC-Stina"
          /> */}

          <TextField
            fullWidth label="Сайт клубу" value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            size="small" sx={{ mb: 3 }}
            placeholder="https://stina.pangeya.org.ua"
          />
          {/* Градієнт */}
          <TextField
            fullWidth select SelectProps={{ native: true }}
            label="Градієнт банера" value={gradient}
            onChange={(e) => setGradient(e.target.value)}
            sx={{ mb: 3 }} size="small"
          >
            {GRADIENT_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </TextField>

          {/* Zoom */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>Zoom на карті</Typography>
            <Stack direction="row" spacing={1}>
              {[true, false].map((v) => (
                <Chip
                  key={String(v)}
                  label={v ? 'Увімкнено' : 'Вимкнено'}
                  variant={zoom === v ? 'filled' : 'outlined'}
                  color={zoom === v ? 'primary' : 'default'}
                  onClick={() => setZoom(v)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Статуси */}
      {error && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#fff0f0', borderRadius: 2, color: 'red' }}>{error}</Box>
      )}
      {success && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fff4', borderRadius: 2, color: 'green' }}>{successMessage}</Box>
      )}
    </Container>
  );
}