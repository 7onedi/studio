'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileUrl: string;
}

const PREFETCH_AHEAD = 2;
const DEFAULT_ASPECT = 16 / 9;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

export default function PdfPresentationViewer({ fileUrl }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [aspect, setAspect] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ratio = aspect ?? DEFAULT_ASPECT;
  let fitWidth = containerSize.width;
  let fitHeight = fitWidth / ratio;
  if (fitHeight > containerSize.height) {
    fitHeight = containerSize.height;
    fitWidth = fitHeight * ratio;
  }
  const renderWidth = fitWidth * zoom;

  const prefetchPages = numPages
    ? Array.from(
        { length: Math.min(PREFETCH_AHEAD, numPages - pageNumber) },
        (_, i) => pageNumber + i + 1
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className={`flex-1 min-h-0 w-full ${
          zoom > 1 ? 'overflow-auto' : 'overflow-hidden flex items-center justify-center'
        }`}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="text-sm text-gray-500 py-12">Завантаження...</div>}
          error={<div className="text-sm text-red-500 py-12">Не вдалося завантажити файл</div>}
        >
          {renderWidth > 0 && (
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              width={renderWidth}
              onLoadSuccess={(page) => {
                if (aspect === null) setAspect(page.width / page.height);
              }}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          )}

          {/* тихий пре-рендер наступних сторінок */}
          {renderWidth > 0 &&
            prefetchPages.map((p) => (
              <div key={p} className="hidden">
                <Page
                  pageNumber={p}
                  width={renderWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            ))}
        </Document>
      </div>

      <div className="flex items-center justify-center gap-2 py-2 shrink-0 border-t border-black/5">
        <button
          onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
          disabled={zoom <= ZOOM_MIN}
          className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
        >
          <IconZoomOut size={18} />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="text-xs tabular-nums w-12 text-center hover:underline"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
          disabled={zoom >= ZOOM_MAX}
          className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
        >
          <IconZoomIn size={18} />
        </button>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-3 shrink-0">
          <button
            onClick={() => setPageNumber(1)}
            disabled={pageNumber <= 1}
            className="p-2 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
          >
            <IconChevronsLeft size={20} />
          </button>
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-2 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
          >
            <IconChevronLeft size={20} />
          </button>
          <span className="text-sm tabular-nums">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
          >
            <IconChevronRight size={20} />
          </button>
          <button
            onClick={() => setPageNumber(numPages)}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-full hover:bg-black/5 disabled:opacity-30 transition"
          >
            <IconChevronsRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}