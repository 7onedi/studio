import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

const CACHE = path.join(process.cwd(), '.cache', 'thumbs');
const W = 240;
const headers = {
  'Content-Type': 'image/webp',
  'Cache-Control': 'public, max-age=31536000, immutable',
};

sharp.cache(false);
sharp.concurrency(1);

let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T,>(fn: () => Promise<T>): Promise<T> => {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
};

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!id) return new NextResponse(null, { status: 400 });

  const file = path.join(CACHE, `${id}-${W}.webp`);
  try {
    return new NextResponse(new Uint8Array(await fs.readFile(file)), { headers });
  } catch {}

  const m = await prisma.media.findUnique({ where: { id }, select: { url: true } });
  if (!m) return new NextResponse(null, { status: 404 });

  try {
    const src = path.join(process.cwd(), 'public', m.url);
    const buf = await enqueue(() =>
      sharp(src, { limitInputPixels: 100_000_000 })
        .rotate()
        .resize(W, W, { fit: 'cover' })
        .webp({ quality: 70 })
        .toBuffer()
    );
    await fs.mkdir(CACHE, { recursive: true });
    await fs.writeFile(file, buf);
    return new NextResponse(new Uint8Array(buf), { headers });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}