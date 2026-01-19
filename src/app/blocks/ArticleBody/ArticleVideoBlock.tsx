"use client";

import Image from "next/image";
import { useState } from "react";

export type VideoProvider = "youtube" | "instagram" | "facebook";

export type VideoBlockData = {
  provider: VideoProvider;
  url: string;
  title?: string;
  preview?: string; // для IG/FB бажано давати з бекенду
};

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

function getPreviewUrl(provider: VideoProvider, url: string, preview?: string): string {
  if (preview) return preview;

  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
  }

  // IG/FB: краще віддавати preview з бекенду (oEmbed/thumbnail)
  return "";
}

function getEmbedUrl(provider: VideoProvider, url: string): string {
  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : "";
  }

  if (provider === "instagram") {
    const clean = url.split("?")[0].replace(/\/$/, "");
    return `${clean}/embed`;
  }

  const encoded = encodeURIComponent(url);
  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=true`;
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0b0b0c] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div className="truncate text-sm text-white/80">{title ?? ""}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-white/80 hover:bg-white/10"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video w-full">{children}</div>
      </div>
    </div>
  );
}

export default function ArticleVideoBlock({ data }: { data: VideoBlockData }) {
  const [open, setOpen] = useState(false);

  const title = data.title ?? "";
  const previewUrl = getPreviewUrl(data.provider, data.url, data.preview);
  const embedUrl = getEmbedUrl(data.provider, data.url);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        aria-label={title || "Відкрити відео"}
      >
        <div className="relative aspect-video w-full">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={title || "Video preview"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              Немає превʼю (для IG/FB дай preview з бекенду)
            </div>
          )}

          {/* play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-full bg-black/60 px-5 py-3 text-white transition-transform group-hover:scale-105">
                ▶
            </div>
          </div>

          <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {title ? (
          <div className="px-4 py-3 text-left bg-black text-white">
            <div className="text-sm lg:text-base">{title}</div>
          </div>
        ) : null}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title} >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            width="560" height="315"
            allowFullScreen
            title={title || "Video"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            Не вдалося зібрати embed URL
          </div>
        )}
      </Modal>
    </>
  );
}
