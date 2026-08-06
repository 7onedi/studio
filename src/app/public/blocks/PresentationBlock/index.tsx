'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, IconButton, Button } from '@mui/material';
import { IconExternalLink, IconDownload, IconPresentation } from '@tabler/icons-react';
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

  const isUk = locale === 'uk';
  const activeUrl = isUk ? (url_uk || url) : url;
  const activeTitle = isUk ? (title_uk || title) : title;
  const activeDescription = isUk ? (description_uk || description) : description;

  if (!activeUrl) return null;

  const fileId = extractDriveId(activeUrl);
  const proxyUrl = fileId ? `/api/presentation-proxy/${fileId}` : null;
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : activeUrl;

  return (
    <div className="my-8 flex justify-end">
      <div className="relative group">
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-main-amarant/10 hover:bg-main-amarant/20 flex items-center justify-center transition"
        >
          <IconPresentation size={28} className="text-main-amarant" />
        </button>

        {(activeTitle || activeDescription) && (
          <div
            className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white shadow-lg p-4 text-right
                       opacity-0 invisible translate-y-1
                       group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                       transition pointer-events-none z-10"
          >
            {activeTitle && (
              <p className="text-sm font-semibold mb-1 break-words">{activeTitle}</p>
            )}
            {activeDescription && (
              <p className="text-xs text-main-text break-words whitespace-pre-line">
                {activeDescription}
              </p>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        fullWidth
        sx={{ '& .MuiDialog-paper': { height: '92vh' } }}
      >
        <IconButton
          component="a"
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, background: 'white' }}
        >
          <IconExternalLink size={20} />
        </IconButton>
        <DialogContent sx={{ p: 0, height: '100%' }}>
            {proxyUrl && <PdfPresentationViewer fileUrl={proxyUrl} />}
        </DialogContent>
        <div className="p-3 flex justify-end">
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