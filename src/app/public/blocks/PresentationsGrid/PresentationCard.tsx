'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/app/providers/LanguageProvider';
import PresentationCoverThumbnail from './PresentationCoverThumbnail';

const PresentationViewerDialog = dynamic(() => import('@blocks/PresentationViewerDialog'), { ssr: false });

export interface PresentationEntry {
  title: string;
  description: string;
  url: string;
  title_uk: string;
  description_uk: string;
  url_uk: string;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PresentationCard({ presentation }: { presentation: PresentationEntry }) {
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();

  const isUk = locale === 'uk';
  const title = isUk ? (presentation.title_uk || presentation.title) : presentation.title;
  const description = isUk ? (presentation.description_uk || presentation.description) : presentation.description;
  const url = isUk ? (presentation.url_uk || presentation.url) : presentation.url;

  if (!url) return null;

  const fileId = extractDriveId(url);
  const proxyUrl = fileId ? `/api/presentation-proxy/${fileId}` : null;

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative group w-full text-left">
        <div className="bg-transparent overflow-hidden rounded-t-2xl border-b-2 border-main-amarant">
          <div className="relative aspect-[210/305] w-full">
            {proxyUrl ? (
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <PresentationCoverThumbnail fileUrl={proxyUrl} />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gray-200" />
            )}
          </div>
        </div>

        <div className="absolute text-center left-1/2 -translate-x-1/2 -bottom-4 px-6 py-2 bg-main-amarant border-main-amarant text-white text-sm font-semibold rounded-full border-b-2">
          {title}
        </div>
      </button>

      {open && (
        <PresentationViewerDialog
          open={open}
          onClose={() => setOpen(false)}
          url={url}
          title={title}
          description={description}
        />
      )}
    </>
  );
}