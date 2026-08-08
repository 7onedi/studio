'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IconExternalLink, IconDownload, IconPresentation, IconX } from '@tabler/icons-react';
import { useLanguage } from '@/app/providers/LanguageProvider';

const PdfPresentationViewer = dynamic(() => import('@components/PdfPresentationViewer'), { ssr: false });

interface Props {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  title_uk?: string | null;
  description_uk?: string | null;
  url_uk?: string | null;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PresentationBlock({
  title,
  description,
  url,
  title_uk,
  description_uk,
  url_uk,
}: Props) {
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const isUk = locale === 'uk';
  const activeUrl = isUk ? (url_uk || url) : url;
  const activeTitle = isUk ? (title_uk || title) : title;
  const activeDescription = isUk ? (description_uk || description) : description;

  if (!activeUrl) return null;

  const fileId = extractDriveId(activeUrl);
  const proxyUrl = fileId ? `/api/presentation-proxy/${fileId}` : null;
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : activeUrl;

  return (
    <div className="my-8 flex justify-center lg:justify-end">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-4 max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition text-right"
      >
        {(activeTitle || activeDescription) && (
          <div className="flex flex-col items-end min-w-0">
            {activeTitle && (
              <p className="text-sm font-semibold break-words">{activeTitle}</p>
            )}
            {activeDescription && (
              <p className="text-xs text-main-text break-words">{activeDescription}</p>
            )}
          </div>
        )}
        <div className="shrink-0 w-12 h-12 rounded-full bg-main-amarant/10 flex items-center justify-center">
          <IconPresentation size={24} className="text-main-amarant" />
        </div>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen={fullScreen}
        sx={{ '& .MuiDialog-paper': { height: fullScreen ? '100%' : '92vh' } }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: 'white' }}
        >
          <IconX size={20} />
        </IconButton>

        <DialogContent sx={{ p: 0, height: '100%' }}>
          {proxyUrl && <PdfPresentationViewer fileUrl={proxyUrl} />}
        </DialogContent>

        <div className="p-3 flex items-center justify-between shrink-0">
          <IconButton
            component="a"
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
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
    </div>
  );
}