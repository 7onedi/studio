import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

sharp.cache(false);
sharp.concurrency(1);

const PUBLIC = path.join(process.cwd(), 'public');
const WIDTH = { desktop: 1920, mobile: 800 } as const;
type Variant = keyof typeof WIDTH;

const cropSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
});
export const cropsSchema = z.object({
  desktop: cropSchema.nullable().optional(),
  mobile: cropSchema.nullable().optional(),
});
export type Crop = z.infer<typeof cropSchema>;

const remove = (url?: string | null) =>
  url ? fs.rm(path.join(PUBLIC, url), { force: true }) : Promise.resolve();

async function render(srcUrl: string, crop: Crop, variant: Variant) {
  const hash = crypto.createHash('sha1').update(JSON.stringify(crop)).digest('hex').slice(0, 8);
  const base = path.posix.basename(srcUrl, path.posix.extname(srcUrl));
  const url = path.posix.join(path.posix.dirname(srcUrl), `${base}-${variant}-${hash}.avif`);

  await sharp(path.join(PUBLIC, srcUrl), { limitInputPixels: 100_000_000, sequentialRead: true })
    .rotate()
    .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
    .resize({ width: WIDTH[variant], withoutEnlargement: true })
    .avif({ quality: 55, effort: 3 })
    .toFile(path.join(PUBLIC, url));
  return url;
}

export const mediaCropService = {
  async setCrops(id: number, input: z.infer<typeof cropsSchema>) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new Error('NOT_FOUND');

    const data: Record<string, unknown> = {};
    const oldUrls: string[] = [];

    // послідовно, не Promise.all — щоб не піднімати пам'ять
    for (const v of ['desktop', 'mobile'] as const) {
      const crop = input[v];
      if (crop === undefined) continue;
      const urlKey = v === 'desktop' ? 'cropDesktopUrl' : 'cropMobileUrl';
      const cropKey = v === 'desktop' ? 'cropDesktop' : 'cropMobile';
      const oldUrl = media[urlKey];

      const newUrl = crop ? await render(media.url, crop, v) : null;
      data[cropKey] = crop ?? null;
      data[urlKey] = newUrl;
      if (oldUrl && oldUrl !== newUrl) oldUrls.push(oldUrl);
    }

    const updated = await prisma.media.update({ where: { id }, data });
    await Promise.all(oldUrls.map(remove));
    return updated;
  },

  async removeFiles(media: { cropDesktopUrl?: string | null; cropMobileUrl?: string | null }) {
    await Promise.all([remove(media.cropDesktopUrl), remove(media.cropMobileUrl)]);
  },
};