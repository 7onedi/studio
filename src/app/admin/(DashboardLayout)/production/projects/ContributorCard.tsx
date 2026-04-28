'use client';

import { useState } from 'react';
import {
  Box, TextField, Stack, Typography, IconButton, Button,
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';

export interface Contributor {
  name: string;
  title: string;
  text: string;
  profileImg: string;
  links: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

interface Props {
  contributor: Contributor;
  index: number;
  onChange: (idx: number, val: Contributor) => void;
  onRemove: (idx: number) => void;
}

export default function ContributorCard({ contributor, index, onChange, onRemove }: Props) {
  const update = (field: keyof Contributor, val: any) =>
    onChange(index, { ...contributor, [field]: val });

  const updateLink = (field: keyof Contributor['links'], val: string) =>
    onChange(index, { ...contributor, links: { ...contributor.links, [field]: val } });

  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    update('profileImg', data.url);
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2" fontWeight={600}>Учасник {index + 1}</Typography>
        <IconButton size="small" color="error" onClick={() => onRemove(index)}>
          <IconTrash size={16} />
        </IconButton>
      </Stack>

      <Stack spacing={2}>
        {/* Фото */}
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>Фото</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {contributor.profileImg && (
              <Box
                component="img"
                src={contributor.profileImg}
                sx={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <Button variant="outlined" size="small" component="label">
              Завантажити
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
              />
            </Button>
          </Stack>
        </Box>

        <TextField
          label="Ім'я" value={contributor.name} size="small" fullWidth
          onChange={(e) => update('name', e.target.value)}
        />
        <TextField
          label="Посада / роль" value={contributor.title} size="small" fullWidth
          onChange={(e) => update('title', e.target.value)}
        />
        <TextField
          label="Опис" value={contributor.text} size="small" fullWidth multiline minRows={2}
          onChange={(e) => update('text', e.target.value)}
        />

        {/* Соцмережі */}
        <Typography variant="caption" color="text.secondary">Соціальні мережі</Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Instagram" value={contributor.links.instagram ?? ''} size="small" fullWidth
            onChange={(e) => updateLink('instagram', e.target.value)}
          />
          <TextField
            label="Facebook" value={contributor.links.facebook ?? ''} size="small" fullWidth
            onChange={(e) => updateLink('facebook', e.target.value)}
          />
          <TextField
            label="TikTok" value={contributor.links.tiktok ?? ''} size="small" fullWidth
            onChange={(e) => updateLink('tiktok', e.target.value)}
          />
        </Stack>
      </Stack>
    </Box>
  );
}