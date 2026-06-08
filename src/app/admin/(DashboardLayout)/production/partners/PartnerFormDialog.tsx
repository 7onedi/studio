'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, MenuItem,
  Box, Switch, FormControlLabel, Chip,
} from '@mui/material';
import { Partner } from './PartnersTable';
import dynamic from 'next/dynamic';
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';

const PartnerDescriptionEditor = dynamic(
  () => import('../../components/editor/PartnerDescriptionEditor'),
  { ssr: false }
);


interface Props {
  open: boolean;
  initial?: Partner;
  defaultRole?: Partner['role'];
  onClose: () => void;
  onSaved: (partner: Partner) => void;
}

const ROLES: { label: string; value: Partner['role'] }[] = [
  { label: 'Member',    value: 'MEMBER'  },
  { label: 'Donor',   value: 'DONOR'   },
  { label: 'Partner', value: 'PARTNER' },
];

const STATUSES: { label: string; value: Partner['status'] }[] = [
  { label: 'Pending',   value: 'PENDING'  },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const STATUS_COLOR: Record<Partner['status'], 'warning' | 'success' | 'error'> = {
  PENDING:  'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};


function ImageUploadBox({
  previewSrc, existingUrl, onUpload, onRemove,
}: {
  previewSrc: string | null;
  existingUrl: string | null;
  onUpload: (base64: string) => void;
  onRemove: () => void;
}) {
  const src = previewSrc ?? existingUrl ?? null;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>Logo</Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: src ? 'primary.main' : 'grey.300',
          borderRadius: 2, p: 2, textAlign: 'center',
          cursor: 'pointer', position: 'relative',
          minHeight: 120, display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
        onClick={() => document.getElementById('partner-image-input')?.click()}
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
            Click to upload image (max 5MB)
          </Typography>
        )}
      </Box>
      <input
        id="partner-image-input"
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

export default function PartnerFormDialog({ open, initial, defaultRole, onClose, onSaved }: Props) {
  const isEdit = Boolean(initial?.id);

  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [description, setDescription] = useState<any>(null);
  const [link, setLink] = useState('');
  const [role,        setRole]        = useState<Partner['role']>('MEMBER');
  const [status,      setStatus]      = useState<Partner['status']>('PENDING');
  const [published,   setPublished]   = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setEmail(initial?.email ?? '');
      setLink(initial?.link ?? '');
      setRole(initial?.role ?? defaultRole ?? 'MEMBER');
      setStatus(initial?.status ?? 'PENDING');
      setPublished(initial?.published ?? false);
      
      setImageBase64(null);
      setError('');
      setImageBase64(null);
      setImageUrl(null);
      setSelectedImageId(initial?.imageId ?? null);
    }
  }, [open, initial, defaultRole]);

  useEffect(() => {
  if (open) {
    try {
      const raw = initial?.description;
      setDescription(raw ? JSON.parse(raw) : null);
    } catch {
      setDescription(null);
    }
  }
}, [open, initial]);

  const handleSubmit = async () => {
    if (!name.trim())  { setError("Name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }

    setSaving(true);
    setError('');

    try {
      // 1. Завантаження фото
      let imageId: number | null = selectedImageId ?? initial?.imageId ?? null;
      if (imageBase64 && imageBase64.startsWith('data:')) {
        const blob = await (await fetch(imageBase64)).blob();
        const fd = new FormData();
        fd.append('file', blob, 'partner.jpg');
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
        if (!res.ok) throw new Error('Помилка завантаження фото');
        imageId = (await res.json()).id;
      }

        // 2. Створення або оновлення
        const url    = isEdit ? `/api/partners/${initial!.id}` : '/api/partners';
        const method = isEdit ? 'PATCH' : 'POST';

        const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            name:        name.trim(),
            email:       email.trim(),
            description: description ? JSON.stringify(description) : null,
            role,
            link: link.trim() || null,
            ...(imageId && { imageId }),
        }),
        });
        if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `Error ${res.status}`);
        }
        let saved: Partner = await res.json();

        // статус і публікація — тільки при редагуванні
        // замість блоку з publish/unpublish
        if (isEdit) {
            if (saved.status !== status) {
                const resStatus = await fetch('/api/partners/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: saved.id, status }),
                });
                if (!resStatus.ok) throw new Error('Error changing status');
                saved = await resStatus.json();
            }

            if (saved.published !== published) {
                if (published) {
                // вмикаємо — через publish endpoint
                const resPublish = await fetch('/api/partners/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: saved.id }),
                });
                if (!resPublish.ok) throw new Error('Error publishing');
                saved = await resPublish.json();
                } else {
                const res = await fetch('/api/partners/unpublish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: saved.id }),
                });
                if (!res.ok) throw new Error('Error unpublishing');
                saved = await res.json(); 
                }
            }
        }

      // 3. Статус (окремий endpoint)
      if (saved.status !== status) {
        const resStatus = await fetch('/api/partners/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: saved.id, status }),
        });
        if (!resStatus.ok) throw new Error('Error changing status');
        saved = await resStatus.json();
      }

      // 4. Публікація (окремий endpoint)
      if (saved.published !== published) {
        const resPublish = await fetch('/api/partners/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: saved.id }),
        });
        if (!resPublish.ok) throw new Error('Error publishing');
        saved = await resPublish.json();
      }

      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = ROLES.find((r) => r.value === (initial?.role ?? defaultRole))?.label ?? ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? `Edit ${roleLabel}` : `New ${roleLabel}`}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>

        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>Logo</Typography>
          {(imageBase64 ?? imageUrl ?? initial?.image?.url) ? (
            <Box sx={{ position: 'relative', mb: 1 }}>
              <Box component="img"
                src={imageBase64 ?? imageUrl ?? initial?.image?.url}
                sx={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 2 }}
              />
              <Button size="small" color="error" variant="contained"
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => { setImageBase64(null); setImageUrl(null); setSelectedImageId(null); }}>
                Remove
              </Button>
            </Box>
          ) : null}
          <Button variant="outlined" fullWidth size="small" onClick={() => setMediaPickerOpen(true)}>
            {(imageBase64 ?? imageUrl ?? initial?.image?.url) ? 'Change Logo' : 'Select Logo'}
          </Button>
        </Box>

        <MediaPickerDialog
          open={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          selected={selectedImageId}
          onSelect={(item: MediaItem) => {
            setImageUrl(item.url);
            setImageBase64(item.url);
            setSelectedImageId(item.id);
          }}
        />

          <TextField
            label="Name *" value={name} size="small" fullWidth
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email *" value={email} size="small" fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Description</Typography>
            <PartnerDescriptionEditor
                onChange={setDescription}
                initialData={description}
            />
          </Box>

          <TextField
            label="Link (URL)" value={link} size="small" fullWidth
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />


          <TextField
            select label="Role" value={role} size="small" fullWidth
            onChange={(e) => setRole(e.target.value as Partner['role'])}
          >
            {ROLES.map(({ label, value }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Статус опрацювання</Typography>
            <Stack direction="row" spacing={1}>
                {STATUSES.map(({ label, value }) => (
                <Chip
                    key={value}
                    label={label}
                    color={status === value ? STATUS_COLOR[value] : 'default'}
                    variant={status === value ? 'filled' : 'outlined'}
                    onClick={() => setStatus(value)}
                    sx={{ cursor: 'pointer' }}
                />
                ))}
            </Stack>
        </Box>

          <FormControlLabel
            control={
              <Switch
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            }
            label="Published"
          />

          {error && (
            <Typography variant="caption" color="error">{error}</Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Saved'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}