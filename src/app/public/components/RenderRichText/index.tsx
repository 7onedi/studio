import { ReactNode } from "react";

export type RichTextItem =
  | string
  | { strong: string }
  | { br: true }
  | { p: RichTextItem[] };

export function renderRichText(
  content: RichTextItem[]
): ReactNode {
  return content.map((item, index) => {
    if (typeof item === "string") {
      return <span key={index}>{item}</span>;
    }

    if ("strong" in item) {
      return (
        <strong key={index} className="text-main-text">
          {item.strong}
        </strong>
      );
    }

    if ("br" in item) {
      return <br key={index} />;
    }

    if ("p" in item) {
      return (
        <p key={index} className="mb-4">
          {renderRichText(item.p)}
        </p>
      );
    }

    return null;
  });
}