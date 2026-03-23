import { NextRequest, NextResponse } from "next/server";
import { mediaController } from "@/api/controllers/media.controller";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });
    
    const media = await mediaController.findByUrl(url);
    if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(media);
}