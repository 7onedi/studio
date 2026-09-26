'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, Divider, Box,
} from '@mui/material';

const PresentationCoverThumbnail = dynamic(
  () => import('@blocks/PresentationsGrid/PresentationCoverThumbnail'),
  { ssr: false }
);

interface PresentationEntry {
  title: string;
  description: string;
  url: string;
  title_uk: string;
  description_uk: string;
  url_uk: string;
}

interface Props {
  open: boolean;
  initial: PresentationEntry;
  isEdit: boolean;
  onClose: () => void;
  onSave: (entry: PresentationEntry) => void;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PresentationEntryDialog({ open, initial, isEdit, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<PresentationEntry>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const enFileId = extractDriveId(draft.url);
  const ukFileId = extractDriveId(draft.url_uk);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit presentation' : 'New presentation'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          <Typography variant="caption" color="text.secondary">English (default)</Typography>
          <TextField
            label="Title" size="small" fullWidth value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <TextField
            label="Description" size="small" fullWidth multiline minRows={2}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
          <TextField
            label="Google Drive link" size="small" fullWidth value={draft.url}
            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
            onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
          />
          {enFileId && (
            <Box sx={{ position: 'relative', width: 90, height: 127, borderRadius: 1, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <PresentationCoverThumbnail fileUrl={`/api/presentation-proxy/${enFileId}`} />
            </Box>
          )}

          <Divider />

          <Typography variant="caption" color="text.secondary">Ukrainian</Typography>
          <TextField
            label="Title (UK)" size="small" fullWidth value={draft.title_uk}
            onChange={(e) => setDraft((d) => ({ ...d, title_uk: e.target.value }))}
          />
          <TextField
            label="Description (UK)" size="small" fullWidth multiline minRows={2}
            value={draft.description_uk}
            onChange={(e) => setDraft((d) => ({ ...d, description_uk: e.target.value }))}
          />
          <TextField
            label="Google Drive link (UK)" size="small" fullWidth value={draft.url_uk}
            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
            onChange={(e) => setDraft((d) => ({ ...d, url_uk: e.target.value }))}
          />
          {ukFileId && (
            <Box sx={{ position: 'relative', width: 90, height: 127, borderRadius: 1, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <PresentationCoverThumbnail fileUrl={`/api/presentation-proxy/${ukFileId}`} />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(draft)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}