'use client';

import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, Divider, Box,
} from '@mui/material';
import { IconPresentation } from '@tabler/icons-react';
import MediaPickerDialog, { MediaItem } from '../../components/Mediapickerdialog';

interface PresentationEntry {
  title: string;
  description: string;
  url: string;
  title_uk: string;
  description_uk: string;
  url_uk: string;
  logo: string;
  logoId: number | null;
}

interface Props {
  open: boolean;
  initial: PresentationEntry;
  isEdit: boolean;
  onClose: () => void;
  onSave: (entry: PresentationEntry) => void;
}

export default function PresentationEntryDialog({ open, initial, isEdit, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<PresentationEntry>(initial);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit presentation' : 'New presentation'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Logo</Typography>
            <Box
              sx={{
                position: 'relative',
                border: '1px dashed',
                borderColor: draft.logo ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                mb: 1,
              }}
            >
              {draft.logo ? (
                <>
                  <Box component="img" src={draft.logo}
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  <Button size="small" color="error" variant="contained"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => setDraft((d) => ({ ...d, logo: '', logoId: null }))}>
                    Remove
                  </Button>
                </>
              ) : (
                <IconPresentation size={56} color="#bbb" />
              )}
            </Box>
            <Button variant="outlined" fullWidth size="small" onClick={() => setLogoPickerOpen(true)}>
              {draft.logo ? 'Change Logo' : 'Select Logo'}
            </Button>
          </Box>

          <MediaPickerDialog
            open={logoPickerOpen}
            onClose={() => setLogoPickerOpen(false)}
            selected={draft.logoId}
            onSelect={(item: MediaItem) => {
              setDraft((d) => ({ ...d, logo: item.url, logoId: item.id }));
            }}
          />

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
  );
}