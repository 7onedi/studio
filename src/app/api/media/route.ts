import { NextRequest, NextResponse } from "next/server";
import { mediaController } from "@/api/controllers/media.controller";
import { withAuth } from "@/app/api/middleware/auth";

// GET /api/media
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 24);
  const media = await mediaController.list(page, limit);
  return NextResponse.json(media);
}

// POST /api/media (upload)
export const POST = withAuth(async (req: NextRequest, user) => {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const uploaded = await mediaController.upload(user, file);
    return NextResponse.json(uploaded, { status: 201 });
});