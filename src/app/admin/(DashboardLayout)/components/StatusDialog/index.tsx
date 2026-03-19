'use client';

import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';

interface StatusDialogProps {
  open: boolean;
  id: number;
  published: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export default function StatusDialog({ open, id, published, onClose, onConfirm }: StatusDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Підтвердження</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {published ? 'Зняти статтю з публікації?' : 'Опублікувати статтю?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button
          color={published ? 'error' : 'success'}
          variant="contained"
          onClick={() => onConfirm(id)}
        >
          {published ? 'Зняти' : 'Опублікувати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}