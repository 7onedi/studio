"use client";

import Image from "next/image";
import { useState } from "react";
import VideoPlayButton from "@/app/public/components/PlayButton";

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

    // youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (u.hostname.includes("youtube.com")) {
      // shorts/VIDEO_ID
      const shorts = u.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts?.[1]) return shorts[1];

      // embed/VIDEO_ID
      const embed = u.pathname.match(/\/embed\/([^/]+)/);
      if (embed?.[1]) return embed[1];

      return u.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumbs(id: string) {
  const base = `https://i.ytimg.com/vi/${id}`;
  return [
    `${base}/maxresdefault.jpg`,
    `${base}/hqdefault.jpg`,
    `${base}/mqdefault.jpg`,
    `${base}/default.jpg`,
  ];
}


function getPreviewUrl(provider: VideoProvider, url: string, preview?: string): string {
  if (preview) return preview;

  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
    // я б одразу hqdefault як "безпечний дефолт"
  }

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
  fullscreenOnMobile = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullscreenOnMobile?: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 z-[1000]"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={[
          "w-full overflow-hidden rounded-2xl bg-[#0b0b0c] shadow-2xl",
          fullscreenOnMobile
            ? "max-w-none h-[100svh] sm:h-auto sm:max-w-4xl"
            : "max-w-4xl",
        ].join(" ")}
      >
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

        <div
          className={[
            "relative w-full",
            fullscreenOnMobile ? "h-[calc(100svh-52px)] sm:aspect-video sm:h-auto" : "aspect-video",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ArticleVideoBlock({ data }: { data: VideoBlockData }) {
  const [open, setOpen] = useState(false);

  const title = data.title ?? "";
  const embedUrl = getEmbedUrl(data.provider, data.url);

    const ytId = data.provider === "youtube" ? getYouTubeId(data.url) : null;
  const ytThumbs = ytId ? getYouTubeThumbs(ytId) : [];

  // якщо preview прийшов з бекенду — він пріоритетний (IG/FB)
  const fallbackPreview = data.preview ?? "";
  const [thumbIdx, setThumbIdx] = useState(0);

  const fullscreenOnMobile = data.provider === "instagram" || data.provider === "facebook";

  const previewUrl =
    fallbackPreview ||
    (data.provider === "youtube" ? ytThumbs[thumbIdx] ?? "" : "");

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
              onError={() => {
                if (fallbackPreview) return;
                if (data.provider !== "youtube") return;
                setThumbIdx((i) => Math.min(i + 1, ytThumbs.length - 1));
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              Немає превʼю (для IG/FB дай preview з бекенду)
            </div>
          )}

          {/* play overlay */}
        <VideoPlayButton href="" />

          <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {title ? (
          <div className="px-4 py-3 text-left bg-black text-white">
            <div className="text-sm lg:text-base">{title}</div>
          </div>
        ) : null}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        fullscreenOnMobile={fullscreenOnMobile}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
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
