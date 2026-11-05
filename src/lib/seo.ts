import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studio.pangeya.org.ua';
export const SITE_NAME = 'Міжкультурна Молодіжна Студія';

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

export function buildMetadata(opts: {
  path: string;
  title: string;
  description?: string;
  image?: string | null;
  locale?: string;
}): Metadata {
  const { path, title, description, image, locale = 'uk_UA' } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      siteName: SITE_NAME,
      locale,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export const OG_LOCALE: Record<string, string> = {
  UK: 'uk_UA', EN: 'en_US', PL: 'pl_PL', LT: 'lt_LT', RO: 'ro_RO',
};

// Перший непорожній параграф EditorJS без HTML, до 160 символів
export function extractDescription(body: any, max = 160): string | undefined {
  const p = (body?.blocks ?? []).find(
    (b: any) => b.type === 'paragraph' && b.data?.text?.trim()
  );
  if (!p) return undefined;
  const text = p.data.text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
}