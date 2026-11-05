"use client";
import { useState } from "react";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import TranslatedText from "@components/TranslatedText";

const btnClass =
  "lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200";

export default function ShareIcons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { name: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: "whatsapp", href: `https://wa.me/?text=${t}%20${u}` },
  ];

  const shareInstagram = async () => {
    if (navigator.share) {
      try { await navigator.share({ url, title }); } catch {}
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 flex items-center gap-4 z-20">
      <a href={links[0].href} target="_blank" rel="noopener noreferrer" className="flex items-center">
        <Button variant="accent-alt" iconOnly className={btnClass}>
          <SvgIcon name="facebook" size={24} color="main-blue" />
        </Button>
      </a>
      <Button variant="accent-alt" iconOnly className={btnClass} onClick={shareInstagram}>
        <SvgIcon name="instagram" size={24} color="main-blue" />
      </Button>
      {links.slice(1).map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
          <Button variant="accent-alt" iconOnly className={btnClass}>
            <SvgIcon name={l.name} size={24} color="main-blue" />
          </Button>
        </a>
      ))}
      {copied && <span><TranslatedText tKey="article.linkCopied" /></span>}
    </div>
  );
}