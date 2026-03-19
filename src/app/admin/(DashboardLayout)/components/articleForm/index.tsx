"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box, Button, Container, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel,
  Chip, OutlinedInput, SelectChangeEvent,
  Switch, FormControlLabel,
} from "@mui/material";

const ReactEditor = dynamic(() => import("../editor/ReactEditor"), {
  ssr: false,
});

const LANGUAGES = ["UK", "EN", "PL", "LT", "RO"];

export interface ArticleFormData {
  title: string;
  lang: string;
  body: unknown;
  authorName: string;
  categoryId: number | "";
  subcategoryIds: number[];
  tags: string[];
  coverBase64?: string | null;
  currentImageId?: number | null;
  published?: boolean;
  slider?: 'NONE' | 'SLIDER_1' | 'SLIDER_2';
}

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>;
  onSave: (data: ArticleFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  successMessage?: string;
  submitLabel?: string;
  title?: string;
  onCancel?: () => void;
}

export default function ArticleForm({
  initialData,
  onSave,
  loading,
  error,
  success,
  successMessage = "Збережено!",
  submitLabel = "Зберегти",
  title = "Стаття",
  onCancel,
}: ArticleFormProps) {
  const [formTitle, setFormTitle] = useState(initialData?.title ?? "");
  const [lang, setLang] = useState(initialData?.lang ?? "UK");
  const [content, setContent] = useState<unknown>(initialData?.body ?? null);
  const [authorName, setAuthorName] = useState(initialData?.authorName ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(initialData?.categoryId ?? "");
  const [subcategoryIds, setSubcategoryIds] = useState<number[]>(initialData?.subcategoryIds ?? []);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [uploadedMediaIds, setUploadedMediaIds] = useState<number[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<{ id: number; url: string }[]>([]);
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);
  const [slider, setSlider] = useState<string>(initialData?.slider ?? 'NONE');
  const [previousImageId, setPreviousImageId] = useState<number | null>(
    initialData?.currentImageId ?? null
  );

  useEffect(() => {
  if (!initialData) return;
  setFormTitle(initialData.title ?? "");
  setLang(initialData.lang ?? "UK");
  setContent(initialData.body ?? null);
  setAuthorName(initialData.authorName ?? "");
  setCategoryId(initialData.categoryId ?? "");
  setSubcategoryIds(initialData.subcategoryIds ?? []);
  setTags(initialData.tags ?? []);
  setCoverBase64(initialData.coverBase64 ?? null);
  setPreviousImageId(initialData.currentImageId ?? null);
  setPublished(initialData.published ?? false);
  setSlider(initialData.slider ?? 'NONE');
}, [initialData])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.items ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!categoryId) { setSubcategories([]); return; }
    fetch(`/api/subcategories/search?categoryId=${categoryId}`)
      .then((r) => r.json())
      .then((data) => {
        setSubcategories(Array.isArray(data) ? data : data.data ?? data.items ?? []);
      })
      .catch(console.error);
  }, [categoryId]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((p) => [...p, trimmed]);
    setTagInput("");
  };

const handleSubmit = () => {
  const bodyContent = content as any;
  
  const usedUrls: string[] = [];
  
  bodyContent?.blocks?.forEach((b: any) => {
    if (b.type === 'image' && b.data?.file?.url) {
      usedUrls.push(b.data.file.url);
    }
    if (b.type === 'gallery' && Array.isArray(b.data?.files)) {
      b.data.files.forEach((f: any) => {
        if (f.url) usedUrls.push(f.url);
      });
    }
  });

  // Видаляємо завантажені але невикористані картинки
  uploadedMedia
    .filter(({ url }) => !usedUrls.includes(url))
    .forEach(({ id }) => {
      fetch(`/api/media/${id}`, { method: 'DELETE', credentials: 'include' });
    });

  onSave({
    title: formTitle,
    lang,
    body: content ?? { blocks: [] },
    authorName,
    categoryId,
    subcategoryIds,
    tags,
    coverBase64,
    currentImageId: previousImageId,
    published,
    slider: slider as 'NONE' | 'SLIDER_1' | 'SLIDER_2',
  });
};

  return (
    <Container maxWidth="xl">

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">{title}</Typography>
        {onCancel && <Button variant="text" onClick={onCancel}>← Назад</Button>}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>

            {/* основний контент */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 10' } }}>
          <TextField fullWidth label="Заголовок *" value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)} sx={{ mb: 3 }} />


          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Додати тег"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>Додати</Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} onDelete={() => setTags((p) => p.filter((t) => t !== tag))} />
              ))}
            </Box>
          </Box>

          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mb: 3, minHeight: 300 }}>
            {content !== null ? (
            <ReactEditor 
              onChange={setContent}
              initialData={content}
              onImageUpload={(id, url) => setUploadedMedia(prev => [...prev, { id, url }])}
            />
            ) : (
              <ReactEditor onChange={setContent} />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={loading} size="large">
              {loading ? "Збереження..." : submitLabel}
            </Button>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} size="large">Скасувати</Button>
            )}
          </Box>
        </Box>

        {/* бічна колонка */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 2' } }}>
          <TextField fullWidth label="Автор *" value={authorName}
            onChange={(e) => setAuthorName(e.target.value)} sx={{ mb: 3 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  color="success"
                />
              }
              label={published ? 'Опубліковано' : 'Чернетка'}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Розміщення в слайдері</InputLabel>
              <Select
                value={slider}
                label="Розміщення в слайдері"
                onChange={(e) => setSlider(e.target.value)}
              >
                <MenuItem value="NONE">Не розміщувати</MenuItem>
                <MenuItem value="SLIDER_1">Банер-Слайдер</MenuItem>
                <MenuItem value="SLIDER_2">Карусель-Слайдер</MenuItem>
              </Select>
            </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Мова</InputLabel>
            <Select value={lang} label="Мова" onChange={(e) => setLang(e.target.value)}>
              {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Категорія *</InputLabel>
            <Select
              value={categoryId}
              label="Категорія *"
              onChange={(e) => { setCategoryId(e.target.value as number); setSubcategoryIds([]); }}
            >
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>

          {subcategories.length > 0 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Підкатегорії</InputLabel>
              <Select
                multiple
                value={subcategoryIds}
                onChange={(e) => {
                const val = e.target.value;
                setSubcategoryIds((typeof val === 'string' ? val.split(',').map(Number) : val as number[]));
                }}
                input={<OutlinedInput label="Підкатегорії" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as number[]).map((id) => (
                      <Chip key={id} label={subcategories.find((s) => s.id === id)?.name ?? id} size="small" />
                    ))}
                  </Box>
                )}
              >
                {subcategories.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Банер статті
            </Typography>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: coverBase64 ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                minHeight: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              {coverBase64 ? (
                <>
                  <Box
                    component="img"
                    src={coverBase64}
                    sx={{ maxWidth: '100%', maxHeight: 240, borderRadius: 1, display: 'block' }}
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('previousImageId:', previousImageId);
                      if (previousImageId) {
                        fetch(`/api/media/${previousImageId}`, { 
                          method: 'DELETE',
                          credentials: 'include',
                        })
                        .then(r => r.json())
                        .then(d => console.log('delete result:', d))
                        .catch(err => console.error('delete error:', err));
                        setPreviousImageId(null);
                      }
                      setCoverBase64(null);
                    }}
                  >
                    Видалити
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary" fontSize={14}>
                  Натисніть щоб завантажити банер
                </Typography>
              )}
            </Box>

            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setCoverBase64(reader.result as string);
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </Box>
        </Box>
      </Box>
      

      {error && (
        <Box sx={{ mb: 2, p: 2, background: "#fff0f0", borderRadius: 2, color: "red" }}>
          {error}
        </Box>
      )}
      {success && (
        <Box sx={{ mb: 2, p: 2, background: "#f0fff4", borderRadius: 2, color: "green" }}>
          {successMessage}
        </Box>
      )}

      
    </Container>
  );
}
