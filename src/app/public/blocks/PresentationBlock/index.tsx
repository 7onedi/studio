'use client';

import { useState } from 'react';
import { IconPresentation } from '@tabler/icons-react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import PresentationViewerDialog from '@blocks/PresentationViewerDialog';

interface Props {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  title_uk?: string | null;
  description_uk?: string | null;
  url_uk?: string | null;
}

export default function PresentationBlock({
  title, description, url, title_uk, description_uk, url_uk,
}: Props) {
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();

  const isUk = locale === 'uk';
  const activeUrl = isUk ? (url_uk || url) : url;
  const activeTitle = isUk ? (title_uk || title) : title;
  const activeDescription = isUk ? (description_uk || description) : description;

  if (!activeUrl) return null;

  return (
    <div className="my-8 flex justify-center lg:justify-end">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-4 max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition text-right"
      >
        {(activeTitle || activeDescription) && (
          <div className="flex flex-col items-end min-w-0">
            {activeTitle && <p className="text-sm font-semibold break-words">{activeTitle}</p>}
            {activeDescription && <p className="text-xs text-main-text break-words">{activeDescription}</p>}
          </div>
        )}
        <div className="shrink-0 w-12 h-12 rounded-full bg-main-amarant/10 flex items-center justify-center">
          <IconPresentation size={24} className="text-main-amarant" />
        </div>
      </button>

      <PresentationViewerDialog open={open} onClose={() => setOpen(false)} url={activeUrl} />
    </div>
  );
}