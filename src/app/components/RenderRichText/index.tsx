import { ReactNode } from "react";

export type RichTextItem =
  | string
  | { strong: string };

export function renderRichText(
  content: RichTextItem[]
): ReactNode {
  return content.map((item, index) => {
    if (typeof item === "string") {
      return <span key={index}>{item}</span>;
    }

    if ("strong" in item) {
      return (
        <strong
          key={index}
          className="font-semibold text-main-text"
        >
          {item.strong}
        </strong>
      );
    }

    return null;
  });
}
