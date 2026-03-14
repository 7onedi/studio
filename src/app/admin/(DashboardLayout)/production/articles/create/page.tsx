"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box, Button, Container, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel,
  Chip, OutlinedInput, SelectChangeEvent,
} from "@mui/material";

const ReactEditor = dynamic(() => import("../../../components/editor/ReactEditor"), {
  ssr: false,
});

const LANGUAGES = ["UK", "EN", "PL", "LT", "RO"];

export default function Create() {
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("UK");
  const [content, setContent] = useState<unknown>(null);
  const [authorName, setAuthorName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [subcategoryIds, setSubcategoryIds] = useState<number[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.items ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    fetch(`/api/subcategories?categoryId=${categoryId}`)
      .then((r) => r.json())
      .then((data) => setSubcategories(Array.isArray(data) ? data : data.items ?? []))
      .catch(console.error);
  }, [categoryId]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleSubcategoryChange = (e: SelectChangeEvent<number[]>) => {
    setSubcategoryIds(e.target.value as number[]);
  };

  const handleSave = async () => {
    if (!title || !authorName || !categoryId) {
      setError("Заповніть обов'язкові поля: заголовок, автор, категорія");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          lang,
          body: content ?? { blocks: [] },
          authorName,
          categoryId: Number(categoryId),
          subcategoryIds,
          tags: tags.map((name) => ({ name })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Помилка ${res.status}`);
      }

      setSuccess(true);
      // Скидаємо форму
      setTitle("");
      setAuthorName("");
      setLang("UK");
      setContent(null);
      setCategoryId("");
      setSubcategoryIds([]);
      setTags([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Створити статтю
      </Typography>

      {error && (
        <Box sx={{ mb: 2, p: 2, background: "#fff0f0", borderRadius: 2, color: "red" }}>
          {error}
        </Box>
      )}
      {success && (
        <Box sx={{ mb: 2, p: 2, background: "#f0fff4", borderRadius: 2, color: "green" }}>
          Статтю успішно збережено!
        </Box>
      )}

      <TextField fullWidth label="Заголовок *" value={title}
        onChange={(e) => setTitle(e.target.value)} sx={{ mb: 3 }} />

      <TextField fullWidth label="Автор *" value={authorName}
        onChange={(e) => setAuthorName(e.target.value)} sx={{ mb: 3 }} />

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
          onChange={(e) => {
            setCategoryId(e.target.value as number);
            setSubcategoryIds([]);
          }}
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
            onChange={handleSubcategoryChange}
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
        <ReactEditor onChange={setContent} />
      </Box>

      <Button variant="contained" onClick={handleSave} disabled={loading} size="large">
        {loading ? "Збереження..." : "Зберегти статтю"}
      </Button>
    </Container>
  );
}