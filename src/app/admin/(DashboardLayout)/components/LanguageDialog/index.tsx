"use client";

import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Box, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';

export interface LangOption {
  code: string;
  icon: string | null;
  label: string;
}

interface LanguageDialogProps {
  open: boolean;
  value: string;
  onChange: (code: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  languages: LangOption[];
  description?: string;
}

export default function LanguageDialog({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
  languages,
  description = "This determines which language tab the article appears under on the site switcher.",
}: LanguageDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select article language</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {description}
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={value}
            label="Language"
            onChange={(e) => onChange(e.target.value)}
          >
            {languages.filter((l) => l.code).map((l) => (
              <MenuItem key={l.code} value={l.code}>
                <Box display="flex" alignItems="center" gap={1}>
                  {l.icon && <img src={l.icon} width={20} height={20} alt={l.label} style={{ borderRadius: 2 }} />}
                  <span>{l.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}