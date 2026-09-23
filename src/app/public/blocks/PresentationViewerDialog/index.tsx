'use client';

import dynamic from 'next/dynamic';
import {
  Dialog, DialogContent, IconButton, Button,
  useMediaQuery, useTheme,
} from '@mui/material';
import { IconExternalLink, IconDownload, IconX } from '@tabler/icons-react';

const PdfPresentationViewer = dynamic(() => import('@components/PdfPresentationViewer'), { ssr: false });

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PresentationViewerDialog({ open, onClose, url }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!url) return null;

  const fileId = extractDriveId(url);
  const proxyUrl = fileId ? `/api/presentation-proxy/${fileId}` : null;
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : url;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { height: fullScreen ? '100%' : '92vh' } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: 'white' }}
      >
        <IconX size={20} />
      </IconButton>

      <DialogContent sx={{ p: 0, height: '100%' }}>
        {proxyUrl && <PdfPresentationViewer fileUrl={proxyUrl} />}
      </DialogContent>

      <div className="p-3 flex items-center justify-between shrink-0">
        <IconButton component="a" href={url} target="_blank" rel="noopener noreferrer">
          <IconExternalLink size={20} />
        </IconButton>

        <Button
          component="a"
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<IconDownload size={16} />}
          variant="outlined"
        >
          Download
        </Button>
      </div>
    </Dialog>
  );
}