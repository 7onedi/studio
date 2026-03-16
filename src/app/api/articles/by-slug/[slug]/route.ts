import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";

export async function GET(req: NextRequest) {
  const slug = String(new URL(req.url).pathname.split("/").pop());
  const article = await articleController.findBySlug(slug);
  return NextResponse.json(article);
}
