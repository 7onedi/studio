"use client";
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
            return (
              <figure
                key={i}
                className={[
                  "mb-4",
                  block.data.withBackground ? "bg-white/5 p-2" : "",
                  block.data.withBorder ? "border border-white/10" : "",
                ].join(" ")}
              >
                <img
                  src={url}
                  alt={block.data.caption ?? ""}
                  className={[
                    "w-full object-cover rounded-xl",
                    block.data.stretched ? "aspect-auto" : "aspect-[16/9]",
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
                        className={[
                          "w-full object-cover",
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

            const imgElement = (
              <img
                src={url}
                alt={block.data.caption ?? ""}
                className="w-full object-cover rounded-xl aspect-[16/9]"
              />
            );

            return (
              <figure key={i} className="mb-4">
                {redirect ? (
                  <div
                    className="block border border-transparent hover:border-[#E91651] hover:border-2 rounded-[14px] transition-colors duration-200 relative cursor-pointer"
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
    </article>
  );
}