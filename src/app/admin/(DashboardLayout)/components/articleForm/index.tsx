"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box, Button, Container, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel,
  Chip, OutlinedInput, SelectChangeEvent,
  Switch, FormControlLabel, Avatar, FormHelperText
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';
import { FieldHelp } from "../shared/FieldHelp";

const ReactEditor = dynamic(() => import("../editor/ReactEditor"), {
  ssr: false,
});

const LANGUAGES = [
  { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
  { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
  { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
  { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
  { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
];

export interface ArticleFormData {
  title: string;
  lang: string;
  body: unknown;
  authorName: string;
  authorAvatarId?: number | null;
  authorAvatarUrl?: string | null; 
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
  successMessage = "Saved successfully",
  submitLabel = "Save",
  title = "Article",
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
  const [uploadedMedia, setUploadedMedia] = useState<{ id: number; url: string }[]>([]);
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);
  const [initialPublished, setInitialPublished] = useState<boolean>(initialData?.published ?? false);
  const [slider, setSlider] = useState<string>(initialData?.slider ?? 'NONE');
  const [gradient, setGradient] = useState<string>(initialData?.gradient ?? 'NONE');
  const [authorInput, setAuthorInput] = useState(initialData?.authorName ?? '');
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorAvatarId, setAuthorAvatarId] = useState<number | null>(initialData?.authorAvatarId ?? null);
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string | null>(null);
  const [authorRole, setAuthorRole] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(initialData?.currentImageId ?? null);
  const [previousImageId, setPreviousImageId] = useState<number | null>(
    initialData?.currentImageId ?? null
  );
  const [authorOptions, setAuthorOptions] = useState<{
    id: number;
    name: string;
    role?: string;
    avatarId?: number | null;
    avatar?: { url: string } | null;
  }[]>([]);

  const helpItems = [
    "Fields marked with an asterisk (*) are required.",
    "Tags are created automatically when entered in the field.",
    "Use video links for YouTube and Facebook Video. For Instagram video, use the Image + Link tool in the editor.",
    "To add a link to text, select the text and click the 'Link' icon in the Text tool.",
    "In the Article Author field, you can search for an existing user or enter any custom name.",
  ];

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
    setAuthorAvatarId(initialData.authorAvatarId ?? null);
    setAuthorAvatarUrl(initialData.authorAvatarUrl ?? null);
    setCategoryId(initialData.categoryId ?? "");
    setSubcategoryIds(initialData.subcategoryIds ?? []);
    setTags(initialData.tags ?? []);
    setCoverBase64(initialData.coverBase64 ?? null);
    setPreviousImageId(initialData.currentImageId ?? null);
    setPublished(initialData.published ?? false);
    setInitialPublished(initialData.published ?? false);
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
    if (initialData) return;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(me => {
        setAuthorName(me.name ?? '');
        setAuthorInput(me.name ?? '');
        setAuthorAvatarId(me.avatarId ?? null);
        setAuthorAvatarUrl(me.avatar?.url ?? null);
        setAuthorRole(me.role ?? null);
      })
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

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (formTitle.trim().length < 3) next.title = "Minimum 3 characters";
    else if (formTitle.trim().length > 200) next.title = "Maximum 200 characters";

    if (authorName.trim().length < 2) next.authorName = "Minimum 2 characters";
    else if (authorName.trim().length > 64) next.authorName = "Maximum 64 characters";

    if (!categoryId) next.categoryId = "Please select a category";
    if (subcategories.length > 0 && subcategoryIds.length === 0) {
      next.subcategoryIds = "Please select at least one subcategory";
    }
    if (!coverBase64) next.cover = "Please select a banner image";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((p) => [...p, trimmed]);
    setTagInput("");
  };
  

const handleSubmit = () => {
  if (!validate()) return;

  if (published !== initialPublished) {
    const action = published ? "publish" : "unpublish";
    if (!confirm(`Are you sure you want to ${action} this article?`)) return;
  }

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
    authorAvatarId,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FieldHelp>
            <Box component="ol" sx={{ pl: 2, m: 0, "& li": { mb: 0.75 } }}>
              {helpItems.map((item, i) => (
                <Typography key={i} component="li" variant="body2">
                  {item}
                </Typography>
              ))}
            </Box>
          </FieldHelp>
          {onCancel && <Button variant="text" onClick={onCancel}>← Cancel</Button>}
        </Box>
      </Box>


      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>

        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 10' } }}>
          <TextField
            fullWidth label="Title *" value={formTitle}
            onChange={(e) => { setFormTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
            error={!!errors.title}
            helperText={errors.title || " "}
            sx={{ mb: 3 }}
          />

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
                setTags(newValue as string[]);
                setTagInput("");
              }}
              filterOptions={(options) => options}
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
            options={authorOptions}
            value={authorOptions.find(u => u.name === authorName) ?? authorName}
            inputValue={authorInput}
            loading={authorLoading}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            onInputChange={(_, value, reason) => {
              setAuthorInput(value);
              if (reason === 'input') {
                setAuthorName(value);
                setAuthorAvatarId(null);
                setAuthorAvatarUrl(null);
                setAuthorRole(null);
                setErrors(p => ({ ...p, authorName: "" }));
              }
            }}
            onChange={(_, value) => {
              if (!value) {
                setAuthorName('');
                setAuthorInput('');
                setAuthorAvatarId(null);
                setAuthorAvatarUrl(null);
                setAuthorRole(null);
              } else if (typeof value === 'string') {
                setAuthorName(value);
                setAuthorInput(value);
                setAuthorAvatarId(null);
                setAuthorAvatarUrl(null);
                setAuthorRole(null);
              } else {
                setAuthorName(value.name);
                setAuthorInput(value.name);
                setAuthorAvatarId(value.avatarId ?? null);
                setAuthorAvatarUrl(value.avatar?.url ?? null);
                setAuthorRole(value.role ?? null);
              }
            }}
            filterOptions={(options) => options}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={typeof option === 'string' ? undefined : option.avatar?.url ?? undefined}
                  sx={{ width: 32, height: 32, fontSize: 14 }}
                >
                  {typeof option === 'string' ? option[0] : option.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {typeof option === 'string' ? option : option.name}
                  </Typography>
                  {typeof option !== 'string' && option.role && (
                    <Typography variant="caption" color="text.secondary">
                      {option.role}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Author *"
                sx={{ mb: 1 }}
                error={!!errors.authorName}
                helperText={errors.authorName || " "}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: authorAvatarUrl ? (
                    <Avatar src={authorAvatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
                  ) : undefined,
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

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Author avatar
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={authorAvatarUrl ?? undefined}
                  sx={{ width: 48, height: 48, fontSize: 18 }}
                >
                  {authorName?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = '';
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/media', {
                          method: 'POST',
                          body: formData,
                          credentials: 'include',
                        });
                        if (!res.ok) return;
                        const data = await res.json();
                        setAuthorAvatarId(data.id);
                        setAuthorAvatarUrl(data.url);
                      }}
                    />
                  </Button>
                  {authorAvatarUrl && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => { setAuthorAvatarId(null); setAuthorAvatarUrl(null); }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

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
              {LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {l.icon && <img src={l.icon} width={24} height={24} alt={l.label} style={{ borderRadius: 2 }} />}
                    <span>{l.label}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.categoryId}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={categoryId}
              label="Category *"
              onChange={(e) => {
                setCategoryId(e.target.value as number);
                setSubcategoryIds([]);
                setErrors(p => ({ ...p, categoryId: "" }));
              }}
            >
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>

          {subcategories.length > 0 && (
            <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.subcategoryIds}>
              <InputLabel>Subcategories</InputLabel>
              <Select
                multiple
                value={subcategoryIds}
                onChange={(e) => {
                  const val = e.target.value;
                  setSubcategoryIds(typeof val === 'string' ? val.split(',').map(Number) : val as number[]);
                  setErrors(p => ({ ...p, subcategoryIds: "" }));
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
              {errors.subcategoryIds && <FormHelperText>{errors.subcategoryIds}</FormHelperText>}
            </FormControl>
          )}

          <Button
            variant="outlined"
            fullWidth
            color={errors.cover ? 'error' : 'primary'}
            onClick={() => setMediaPickerOpen(true)}
            sx={{ mb: errors.cover ? 0.5 : 1 }}
          >
            {coverBase64 ? 'Change Banner' : 'Select Banner'}
          </Button>

          {errors.cover && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
              {errors.cover}
            </Typography>
          )}

          {coverBase64 && (
            <Box sx={{ position: 'relative' }}>
              <Box component="img" src={coverBase64} sx={{ width: '100%', borderRadius: 2 }} />
              <Button
                size="small" color="error" variant="contained"
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => { setCoverBase64(null); setSelectedMediaId(null); }}
              >
                Delete
              </Button>
            </Box>
          )}

          <MediaPickerDialog
            open={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            selected={selectedMediaId}
            onSelect={(item: MediaItem) => {
              setCoverBase64(item.url);
              setSelectedMediaId(item.id);
              setPreviousImageId(item.id);
              setErrors(p => ({ ...p, cover: "" }));
            }}
          />
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
