"use client";
import { useState } from "react";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import TranslatedText from "@components/TranslatedText";

const btnClass =
  "lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200";

export default function ShareIcons({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);

  const links = [
    { name: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "telegram", href: `https://t.me/share/url?url=${u}` },
    { name: "whatsapp", href: `https://wa.me/?text=${u}` },
  ];

  const shareLink = async () => {
    if (navigator.share) {
      try { await navigator.share({ url }); } catch {}
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2 flex items-center gap-4 z-20">
      <Button variant="accent-alt" iconOnly className={btnClass} onClick={shareLink}>
        <SvgIcon name="Link" size={24} color="main-blue" />
      </Button>
      <a href={links[0].href} target="_blank" rel="noopener noreferrer" className="flex items-center">
        <Button variant="accent-alt" iconOnly className={btnClass}>
          <SvgIcon name="facebook" size={24} color="main-blue" />
        </Button>
      </a>
      {links.slice(1).map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
          <Button variant="accent-alt" iconOnly className={btnClass}>
            <SvgIcon name={l.name} size={24} color="main-blue" />
          </Button>
        </a>
      ))}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-0 top-full z-30 mt-2 whitespace-nowrap rounded-lg bg-main-blue px-3 py-2 text-sm text-white shadow-lg transition-all duration-200 ${
          copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        <span className="absolute -top-1 left-5 h-2 w-2 rotate-45 bg-main-blue" />
        <TranslatedText tKey="article.linkCopied" />
      </div>
    </div>
  );
}