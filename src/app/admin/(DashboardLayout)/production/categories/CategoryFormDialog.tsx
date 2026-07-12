'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography,
} from '@mui/material';
import { FieldHelp } from '../../components/shared/FieldHelp';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  open: boolean;
  initial?: Partial<Category>;
  onClose: () => void;
  onSaved: (cat: Category) => void;
}

export default function CategoryFormDialog({ open, initial, onClose, onSaved }: Props) {
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setName(initial?.name ?? ''); setError(''); }
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      const url = isEdit ? `/api/categories/${initial!.id}` : '/api/categories';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
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
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 3 }}>
        {isEdit ? 'Edit Category' : 'New Category'}
        <FieldHelp>
          Fields marked with an asterisk (*) are required.
        </FieldHelp>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" required />
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