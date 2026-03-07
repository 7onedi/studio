import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const article = await articleController.findById(id);
  return NextResponse.json(article);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const updated = await articleController.update(id, body, user);
  return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  await articleController.delete(id, user);
  return NextResponse.json({ message: "Article deleted" }, { status: 200 });
});