import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware/auth';
import { mediaController } from '@/api/controllers/media.controller';
import { cropsSchema } from '@/api/services/media-crop.service';

// PUT /api/media/:id/crop   body: { desktop?: Crop | null, mobile?: Crop | null }
export const PUT = withAuth(async (req: NextRequest) => {
  const id = Number(new URL(req.url).pathname.split('/').at(-2));
  if (!id) return NextResponse.json({ message: 'Bad id' }, { status: 400 });

  const parsed = cropsSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Bad crop' }, { status: 400 });

  try {
    return NextResponse.json(await mediaController.setCrops(id, parsed.data));
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Crop failed' }, { status: 400 });
  }
});