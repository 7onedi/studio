"use client";
import { useMemo, useState } from "react";
import { ImageViewer, ImageViewerItem } from "@components/ImageViewer";
import ArticleVideoBlock, { VideoBlockData } from "./ArticleVideoBlock";
import VideoPlayButton from "@components/PlayButton";

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: { text: string };
};

type HeaderBlock = {
  id: string;
  type: "header";
  data: { text: string; level?: number };
};

type ListBlock = {
  id: string;
  type: "list";
  data: { style: "ordered" | "unordered"; items: readonly string[] };
};

type ImageBlock = {
  id: string;
  type: "image";
  data: {
    file: { url: string };
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};

type GalleryBlock = {
  id: string;
  type: "gallery";
  data: {
    files: readonly { url: string; alt?: string }[];
    caption?: string;
    style?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};

type CustomImageBlock = {
  id: string;
  type: "customImage";
  data: {
    url: string;
    redirectUrl?: string;
    caption?: string;
  };
};

type VideoBlock = {
  id: string;
  type: "video";
  data: VideoBlockData;
};

type EmbedBlock = {
  id: string;
  type: "embed";
  data: { embed: string; caption?: string };
};

type EditorBlock =
  | ParagraphBlock
  | HeaderBlock
  | ListBlock
  | ImageBlock
  | GalleryBlock
  | CustomImageBlock
  | VideoBlock
  | EmbedBlock;

type ArticleBodyProps = {
  blocks: readonly EditorBlock[];
};

export function ArticleBody({ blocks }: ArticleBodyProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [orientations, setOrientations] = useState<Record<string, "landscape" | "portrait">>({});

  const handleImageLoad = (key: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (orientations[key]) return;
    setOrientations((prev) => ({
      ...prev,
      [key]: img.naturalHeight > img.naturalWidth ? "portrait" : "landscape",
    }));
  };

  // збираємо всі зображення статті в один плоский масив + мапу block-index -> global-index
  const { galleryImages, globalIndexByKey } = useMemo(() => {
    const galleryImages: ImageViewerItem[] = [];
    const globalIndexByKey = new Map<string, number>();

    blocks.forEach((block, i) => {
      if (block.type === "image") {
        globalIndexByKey.set(`${i}`, galleryImages.length);
        galleryImages.push({ src: block.data.file?.url ?? "", alt: block.data.caption });
      } else if (block.type === "gallery") {
        block.data.files.slice(0, 4).forEach((file, idx) => {
          globalIndexByKey.set(`${i}-${idx}`, galleryImages.length);
          galleryImages.push({ src: file.url, alt: file.alt ?? block.data.caption });
        });
      } else if (block.type === "customImage") {
        globalIndexByKey.set(`${i}`, galleryImages.length);
        galleryImages.push({ src: block.data.url, alt: block.data.caption });
      }
    });

    return { galleryImages, globalIndexByKey };
  }, [blocks]);

  return (
    <article className="prose prose-invert max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
                className="mb-4"
              />
            );

          case "header":
            return (
              <div
                key={i}
                className={`mb-4 text-headline_${block.data.level}_mobile lg:text-headline_${block.data.level}`}
              >
                {block.data.text}
              </div>
            );

          case "list":
            return block.data.style === "ordered" ? (
              <ol key={i} className="list-decimal pl-6 mb-4">
                {block.data.items.map((item: any, idx: number) => (
                  <li key={idx} dangerouslySetInnerHTML={{
                    __html: typeof item === "string" ? item : item.content ?? "",
                  }} />
                ))}
              </ol>
            ) : (
              <ul key={i} className="list-disc pl-6 mb-4">
                {block.data.items.map((item: any, idx: number) => (
                  <li key={idx} dangerouslySetInnerHTML={{
                    __html: typeof item === "string" ? item : item.content ?? "",
                  }} />
                ))}
              </ul>
            );

          case "image": {
            const url = block.data.file?.url ?? "";
            const key = `${i}`;
            const isPortrait = orientations[key] === "portrait";
            return (
              <figure
                key={i}
                className={[
                  "mb-4",
                  isPortrait ? "w-2/3 mx-auto" : "w-full",
                  block.data.withBackground ? "bg-white/5 p-2" : "",
                  block.data.withBorder ? "border border-white/10" : "",
                ].join(" ")}
              >
                <img
                  src={url}
                  alt={block.data.caption ?? ""}
                  onLoad={handleImageLoad(key)}
                  onClick={() => setLightboxIndex(globalIndexByKey.get(`${i}`) ?? 0)}
                  className={[
                    "w-full object-cover rounded-xl cursor-pointer",
                    block.data.stretched ? "aspect-auto" : isPortrait ? "aspect-[3/4]" : "aspect-[16/9]",
                  ].join(" ")}
                />
                {block.data.caption && (
                  <figcaption className="mt-2 text-body_mobile lg:text-body">
                    <i>{block.data.caption}</i>
                  </figcaption>
                )}
              </figure>
            );
          }

          case "gallery": {
            const files = block.data.files ?? [];
            const count = Math.min(4, files.length);
            const colsClass =
              count === 1 ? "grid-cols-1" :
              count === 2 ? "grid-cols-2" :
              count === 3 ? "grid-cols-3" :
              "grid-cols-2 lg:grid-cols-4";

            return (
              <figure key={i} className="mb-4">
                <div className={`grid ${colsClass} gap-3`}>
                  {files.slice(0, 4).map((file, idx) => (
                    <div
                      key={idx}
                      className={[
                        "overflow-hidden rounded-xl",
                        block.data.withBackground ? "bg-white/5 p-2" : "",
                        block.data.withBorder ? "border border-white/10" : "",
                      ].join(" ")}
                    >
                      <img
                        src={file.url}
                        alt={file.alt ?? block.data.caption ?? ""}
                        onClick={() =>
                          setLightboxIndex(globalIndexByKey.get(`${i}-${idx}`) ?? 0)
                        }
                        className={[
                          "w-full object-cover cursor-pointer",
                          block.data.stretched ? "aspect-auto" : "aspect-[4/3]",
                        ].join(" ")}
                      />
                    </div>
                  ))}
                </div>
                {block.data.caption && (
                  <figcaption className="mt-2 text-body_mobile lg:text-body">
                    <i>{block.data.caption}</i>
                  </figcaption>
                )}
              </figure>
            );
          }

          case "customImage": {
            const url = block.data.url ?? "";
            const redirect = block.data.redirectUrl;
            const key = `${i}`;
            const isPortrait = orientations[key] === "portrait";

            const imgElement = (
              <img
                src={url}
                alt={block.data.caption ?? ""}
                onLoad={handleImageLoad(key)}
                className={[
                  "object-cover",
                  isPortrait ? "mx-auto max-w-[480px] w-full aspect-[3/4]" : "w-full aspect-[16/9] rounded-xl",
                ].join(" ")}
              />
            );

            return (
              <figure key={i} className="mb-4">
                {redirect ? (
                  <div
                    className="bg-black block border border-transparent hover:border-[#E91651] hover:border-2 rounded-[14px] transition-colors duration-200 relative cursor-pointer"
                  >
                    {imgElement}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoPlayButton href={redirect} />
                    </div>
                  </div>
                ) : (
                  imgElement
                )}
                {block.data.caption && (
                  <figcaption className="mt-2 text-body_mobile lg:text-body">
                    <i>{block.data.caption}</i>
                  </figcaption>
                )}
              </figure>
            );
          }

          case "video":
            return (
              <div key={i} className="my-6">
                <ArticleVideoBlock data={block.data} />
              </div>
            );

          case "embed":
            return (
              <figure key={i} className="mb-4">
                <div className="relative" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={(block as any).data.embed}
                    title={(block as any).data.caption ?? "embed"}
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-xl border-0"
                  />
                </div>
                {(block as any).data.caption && (
                  <figcaption className="mt-2 text-body_mobile lg:text-body">
                    <i>{(block as any).data.caption}</i>
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}

       <ImageViewer
        images={galleryImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        renderThumbnails={false}
      />
    </article>
  );
}