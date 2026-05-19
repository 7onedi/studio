'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
} from '@mui/material';
import { Category } from './CategoryFormDialog';

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category?: Category | null;
}

interface Props {
  open: boolean;
  initial?: Partial<Subcategory>;
  categories: Category[];
  /** якщо передано — категорія фіксована і не змінюється */
  fixedCategoryId?: number;
  onClose: () => void;
  onSaved: (sub: Subcategory) => void;
}

export default function SubcategoryFormDialog({
  open, initial, categories, fixedCategoryId, onClose, onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setCategoryId(fixedCategoryId ?? initial?.categoryId ?? '');
      setError('');
    }
  }, [open, initial, fixedCategoryId]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (!categoryId) { setError('Please select a category'); return; }
    setSaving(true);
    try {
      const url = isEdit ? `/api/subcategories/${initial!.id}` : '/api/subcategories';
      
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          categoryId: Number(categoryId),
        })
      });
      console.log('url:', url);
      console.log('body:', JSON.stringify({ name, categoryId: Number(categoryId) }));
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSaved(await res.json());
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Subcategory' : 'New Subcategory'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name" value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth size="small" required
          />
          {!fixedCategoryId && (
            <TextField
              select label="Category" value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              fullWidth size="small" required
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
          )}
          {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}