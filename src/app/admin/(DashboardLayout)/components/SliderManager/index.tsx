'use client';

import { Fragment, useEffect, useState } from 'react';
import { Autocomplete, Avatar, Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import { IconGripVertical, IconX } from '@tabler/icons-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Article } from '../articleTable';

function Item({ a, num, onRemove }: { a: Article; num: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: a.id });
  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, mb: 1 }}
    >
      <IconGripVertical size={18} {...attributes} {...listeners} style={{ cursor: 'grab', flexShrink: 0 }} />
      <Typography variant="body2" fontWeight={700} sx={{ width: 24, textAlign: 'center', flexShrink: 0 }}>{num}</Typography>
      <Avatar variant="rounded" src={(a as any).image?.url} sx={{ width: 48, height: 36 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>{a.title}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          <b>{a.category?.name}</b> / {a.subcategories?.length > 0 && ` / ${a.subcategories.map((s) => s.name).join(', ')}`}
        </Typography>
      </Box>
      <IconButton size="small" onClick={onRemove}><IconX size={16} /></IconButton>
    </Paper>
  );
}

interface SliderListProps {
  slider: 'SLIDER_1' | 'SLIDER_2';
  label: string;
  lang: string;
  version: number;
  perSlide?: number;
  onSaved: () => void;
}

function SliderList({ slider, label, lang, perSlide, version, onSaved }: SliderListProps) {
  const [items, setItems] = useState<Article[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Article[]>([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // завантаження поточного списку
  useEffect(() => {
    const params = new URLSearchParams({
      page: '1', limit: '200', slider, lang,
      sortBy: 'sliderOrder', order: 'asc',
    });
    fetch(`/api/articles/search?${params}`)
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d.data) ? d.data : []); setDirty(false); })
      .catch(console.error);
  }, [slider, lang, version]);

  // пошук статті для додавання
  useEffect(() => {
    if (input.trim().length < 2) { setOptions([]); return; }
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        page: '1', limit: '10', title: input.trim(), lang,
      });
      fetch(`/api/articles/search?${params}`)
        .then((r) => r.json())
        .then((d) => setOptions(Array.isArray(d.data) ? d.data : []))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, lang]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
        setItems((prev) => {
        const v = [...prev].reverse();
        return arrayMove(v, v.findIndex((i) => i.id === active.id), v.findIndex((i) => i.id === over.id)).reverse();
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/articles/slider-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lang, slider, ids: items.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSaved();
    } catch (e: any) {
      alert(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const view = [...items].reverse();

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>{label}</Typography>

      <Autocomplete
        size="small"
        options={options.filter((o) => !items.some((i) => i.id === o.id))}
        getOptionLabel={(o) => o.title}
        value={null}
        inputValue={input}
        onInputChange={(_, v, reason) => { if (reason !== 'reset') setInput(v); }}
        onChange={(_, v) => {
          if (!v) return;
          setItems((p) => [...p, v]);
          setDirty(true);
          setInput('');
          setOptions([]);
        }}
        filterOptions={(o) => o}
        noOptionsText="Type 2+ characters"
        renderInput={(params) => <TextField {...params} placeholder="Add article..." />}
        sx={{ mb: 2 }}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={view.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {view.map((a, idx) => (
            <Fragment key={a.id}>
              {perSlide && idx % perSlide === 0 && (
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mt: idx ? 2 : 0, mb: 0.5 }}>
                  Слайд {idx / perSlide + 1}
                </Typography>
              )}
              <Item
                a={a}
                num={perSlide ? (idx % perSlide) + 1 : idx + 1}
                onRemove={() => { setItems((p) => p.filter((i) => i.id !== a.id)); setDirty(true); }}
              />
            </Fragment>
          ))}
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" mb={1}>Empty</Typography>
      )}

      <Button variant="contained" disabled={!dirty || saving} onClick={save}>
        {saving ? 'Saving...' : 'Save order'}
      </Button>
    </Box>
  );
}

export default function SliderManager({ lang }: { lang: string }) {
  const [version, setVersion] = useState(0);;

  const common = { lang, version, onSaved: () => setVersion((v) => v + 1) };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: 4 }}>
      <SliderList slider="SLIDER_1" label="Banner-Slider" {...common} />
      <SliderList slider="SLIDER_2" label="Carousel-Slider" perSlide={4} {...common} />
    </Box>
  );
}