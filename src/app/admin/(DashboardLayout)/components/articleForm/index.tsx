"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box, Button, Container, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel,
  Chip, OutlinedInput, SelectChangeEvent,
  Switch, FormControlLabel,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const ReactEditor = dynamic(() => import("../editor/ReactEditor"), {
  ssr: false,
});

const LANGUAGES = [
  {"value": "UK", "label": "Українська 🇺🇦"},
  {"value": "EN", "label": "English 🇬🇧"},
  {"value": "PL", "label": "Polski 🇵🇱"},
  {"value": "LT", "label": "Lietuviškai 🇱🇹"},
  {"value": "RO", "label": "Română 🇲🇩"}
];

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
  gradient?: 'NONE' | 'GRADIENT_1' | 'GRADIENT_2';
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
  userRole?: string;
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
  userRole,
}: ArticleFormProps) {
  const [formTitle, setFormTitle] = useState(initialData?.title ?? "");
  const [lang, setLang] = useState(initialData?.lang ?? "UK");
  const [content, setContent] = useState<unknown>(initialData?.body ?? null);
  const [authorName, setAuthorName] = useState(initialData?.authorName ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(initialData?.categoryId ?? "");
  const [subcategoryIds, setSubcategoryIds] = useState<number[]>(initialData?.subcategoryIds ?? []);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagOptions, setTagOptions] = useState<{ id: number; name: string }[]>([]);
  const [tagLoading, setTagLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [uploadedMediaIds, setUploadedMediaIds] = useState<number[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<{ id: number; url: string }[]>([]);
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);
  const [slider, setSlider] = useState<string>(initialData?.slider ?? 'NONE');
  const [gradient, setGradient] = useState<string>(initialData?.gradient ?? 'NONE');
  const [authorOptions, setAuthorOptions] = useState<{ id: number; name: string }[]>([]);
  const [authorInput, setAuthorInput] = useState(initialData?.authorName ?? '');
  const [authorLoading, setAuthorLoading] = useState(false);
  const [previousImageId, setPreviousImageId] = useState<number | null>(
    initialData?.currentImageId ?? null
  );

  useEffect(() => {
    if (!authorInput.trim()) { setAuthorOptions([]); return; }
    const timer = setTimeout(() => {
      setAuthorLoading(true);
      fetch(`/api/users/search?name=${encodeURIComponent(authorInput.trim())}&page=1&limit=10`, { credentials: 'include' })
        .then(r => r.json())
        .then(d => setAuthorOptions(Array.isArray(d.data) ? d.data : []))
        .catch(console.error)
        .finally(() => setAuthorLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [authorInput]);

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
  setGradient(initialData.gradient ?? 'NONE');
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

  useEffect(() => {
  if (!tagInput.trim()) {
    setTagOptions([]);
    return;
  }
  const timer = setTimeout(() => {
    setTagLoading(true);
    fetch(`/api/tags/search?name=${encodeURIComponent(tagInput.trim())}&page=1&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setTagOptions(Array.isArray(data.data) ? data.data : []);
      })
      .catch(console.error)
      .finally(() => setTagLoading(false));
  }, 300);
  return () => clearTimeout(timer);
}, [tagInput]);

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
    if (b.type === 'customImage' && b.data?.url) {
      usedUrls.push(b.data.url);
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
    gradient: gradient as 'NONE' | 'GRADIENT_1' | 'GRADIENT_2',
  });
};

  return (
    <Container maxWidth="xl">

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">{title}</Typography>
        {onCancel && <Button variant="text" onClick={onCancel}>← Cancel</Button>}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>

            {/* основний контент */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 10' } }}>
          <TextField fullWidth label="Title *" value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)} sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Autocomplete
            multiple
            freeSolo
            options={tagOptions.map((t) => t.name)}
            value={tags}
            inputValue={tagInput}
            loading={tagLoading}
            onInputChange={(_, value, reason) => {
              if (reason !== "reset") setTagInput(value);
            }}
            onChange={(_, newValue) => {
              // newValue — масив рядків (існуючі + нові freeSolo)
              setTags(newValue as string[]);
              setTagInput("");
            }}
            filterOptions={(options) => options} // фільтрація на сервері
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Enter tag..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {tagLoading && <CircularProgress size={16} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
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
              {loading ? "Saving..." : submitLabel}
            </Button>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} size="large">Cancel</Button>
            )}
          </Box>
        </Box>

        {/* бічна колонка */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 2' } }}>
          <Autocomplete
            freeSolo
            options={authorOptions.map(u => u.name)}
            value={authorName}
            inputValue={authorInput}
            loading={authorLoading}
            onInputChange={(_, value, reason) => {
              setAuthorInput(value);
              if (reason === 'input') setAuthorName(value);
            }}
            onChange={(_, value) => {
              setAuthorName(value ?? '');
              setAuthorInput(value ?? '');
            }}
            filterOptions={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Author *"
                sx={{ mb: 3 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {authorLoading && <CircularProgress size={16} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

            {userRole !== 'USER' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    color="success"
                  />
                }
                label={published ? 'Published' : 'Draft'}
                sx={{ mb: 3 }}
              />
            )}

            {userRole !== 'USER' && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Placement in slider</InputLabel>
                <Select value={slider} label="Placement in slider" onChange={(e) => setSlider(e.target.value)}>
                  <MenuItem value="NONE">Do not display</MenuItem>
                  <MenuItem value="SLIDER_1">Banner-Slider</MenuItem>
                  <MenuItem value="SLIDER_2">Carousel-Slider</MenuItem>
                </Select>
              </FormControl>
            )}

            {userRole !== 'USER' && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Gradient</InputLabel>
                <Select
                  value={gradient}
                  label="Gradient"
                  onChange={(e) => setGradient(e.target.value)}
                  renderValue={(val) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {val !== 'NONE' && (
                        <Box sx={{
                          width: 16, height: 16, borderRadius: '50%',
                          backgroundColor: val === 'GRADIENT_1' ? '#256BA7' : '#E91651',
                        }} />
                      )}
                      {val === 'NONE' ? 'No gradient' : val === 'GRADIENT_1' ? 'Blue' : 'Red'}
                    </Box>
                  )}
                >
                  <MenuItem value="NONE">No gradient</MenuItem>
                  <MenuItem value="GRADIENT_1">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#256BA7' }} />
                      Blue
                    </Box>
                  </MenuItem>
                  <MenuItem value="GRADIENT_2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#E91651' }} />
                      Red
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Language</InputLabel>
            <Select value={lang} label="Language" onChange={(e) => setLang(e.target.value)}>
              {LANGUAGES.map((l) => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={categoryId}
              label="Category *"
              onChange={(e) => { setCategoryId(e.target.value as number); setSubcategoryIds([]); }}
            >
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>

          {subcategories.length > 0 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Subcategories</InputLabel>
              <Select
                multiple
                value={subcategoryIds}
                onChange={(e) => {
                const val = e.target.value;
                setSubcategoryIds((typeof val === 'string' ? val.split(',').map(Number) : val as number[]));
                }}
                input={<OutlinedInput label="Subcategories" />}
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
              Article Banner
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
                    Delete
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary" fontSize={14}>
                  Click to upload banner
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
