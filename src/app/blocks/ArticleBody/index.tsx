import ArticleVideoBlock, { VideoBlockData } from "./ArticleVideoBlock";

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: { text: string };
};

type HeaderBlock = {
  id: string;
  type: "header";
  data: { text: string, level?: number};
};

type ListBlock = {
  id: string;
  type: "list";
  data: { style: "ordered" | "unordered"; items: readonly string[] };
};

type GalleryBlock = {
  id: string;
  type: "gallery";
  data: {
    files: readonly { url: string; alt?: string }[]; // 1..4
    caption?: string;

    // спільні атрибути (не множимо)
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};

type VideoBlock = {
  id: string;
  type: "video";
  data: VideoBlockData;
};

type EditorBlock =
  | ParagraphBlock
  | HeaderBlock
  | ListBlock
  | GalleryBlock
  | VideoBlock;

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
              <ol key={i} className="mb-4">
                {block.data.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {block.data.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            );

          case "gallery": {
            const count = Math.min(4, block.data.files.length);

            const colsClass =
              count === 1
                ? "grid-cols-1"
                : count === 2
                  ? "lg:grid-cols-2"
                  : count === 3
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-4";

            return (
              <figure key={i} className="mb-4">
                <div className={`grid ${colsClass} gap-3`}>
                  {block.data.files.slice(0, 4).map((f, idx) => (
                    <div
                      key={idx}
                      className={[
                        "relative overflow-hidden",
                        block.data.withBackground ? "bg-white/5 p-2" : "",
                        block.data.withBorder ? "border border-white/10" : "",
                      ].join(" ")}
                    >
                      <img
                        src={f.url}
                        alt={f.alt ?? block.data.caption ?? ""}
                        className={[
                          "h-full w-full object-cover",
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

          case "video":
            return (
              <div key={i} className="my-6">
                <ArticleVideoBlock data={block.data} />
              </div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}
