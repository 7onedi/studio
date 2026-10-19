import { NextRequest, NextResponse } from "next/server";
import { mediaController } from "@/api/controllers/media.controller";
import { withAuth } from "@/app/api/middleware/auth";

// GET /api/media
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 24);
  const raw = url.searchParams.get('q')?.trim();
  const q = raw && raw.length >= 3 ? raw : undefined;
  const where = q ? {
    OR: [
      { filename: { contains: q } },
      { articles: { some: { title: { contains: q } } } },
      { projects: { some: { OR: [{ title: { contains: q } }, { title_en: { contains: q } }] } } },
      { projectLogos: { some: { OR: [{ title: { contains: q } }, { title_en: { contains: q } }] } } },
      { partners: { some: { name: { contains: q } } } },
      { articleAuthorAvatars: { some: { title: { contains: q } } } },
    ],
  } : undefined;
  const focus = Number(url.searchParams.get('focus')) || undefined;
  const media = await mediaController.list(page, limit, where, focus);
  return NextResponse.json(media);
}

// POST /api/media (upload)
export const POST = withAuth(async (req: NextRequest, user) => {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const uploaded = await mediaController.upload(user, file);
    return NextResponse.json(uploaded, { status: 201 });
});