'use client';

import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, Divider, Box,
} from '@mui/material';
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';

export interface PresentationEntry {
  title: string;
  description: string;
  url: string;
  title_uk: string;
  description_uk: string;
  url_uk: string;
  cover?: string;
}

export const EMPTY_PRESENTATION: PresentationEntry = {
  title: '', description: '', url: '',
  title_uk: '', description_uk: '', url_uk: '',
  cover: '',
};

interface Props {
  open: boolean;
  initial: PresentationEntry;
  isEdit: boolean;
  onClose: () => void;
  onSave: (entry: PresentationEntry) => void;
}

export default function PresentationEntryDialog({ open, initial, isEdit, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<PresentationEntry>(initial);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit presentation' : 'New presentation'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cover (first page, A4 portrait, ~600×850 px)
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                <Box
                  sx={{
                    width: 90,
                    aspectRatio: '210 / 297',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {draft.cover ? (
                    <Box
                      component="img"
                      src={draft.cover}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">No cover</Typography>
                  )}
                </Box>
                <Stack spacing={1} alignItems="flex-start">
                  <Button size="small" variant="outlined" onClick={() => setPickerOpen(true)}>
                    {draft.cover ? 'Change cover' : 'Select cover'}
                  </Button>
                  {draft.cover && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDraft((d) => ({ ...d, cover: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>

            <Divider />

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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => onSave(draft)}>Save</Button>
        </DialogActions>
      </Dialog>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selected={null}
        onSelect={(item: MediaItem) => {
          setDraft((d) => ({ ...d, cover: item.url }));
          setPickerOpen(false);
        }}
      />
    </>
  );
}