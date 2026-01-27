import { ReactNode } from "react";
import Link from "next/link";

export type RichTextItem =
  | string
  | { strong: string }
  | { link: { href: string; text?: string; external?: boolean } };

export function renderRichText(content: RichTextItem[]): ReactNode {
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

    if ("link" in item) {
      const { href, text, external } = item.link;
      const label = text ?? href;

      // для зовнішніх — target/_blank + rel
      if (external ?? /^https?:\/\//i.test(href)) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-main-blue underline underline-offset-2 hover:opacity-80"
          >
            {label}
          </a>
        );
      }

      // для внутрішніх — next/link
      return (
        <Link
          key={index}
          href={href}
          className="text-main-blue underline underline-offset-2 hover:opacity-80"
        >
          {label}
        </Link>
      );
    }

    return null;
  });
}
