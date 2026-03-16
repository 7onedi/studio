import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const POST = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const article = await articleController.publish(body, user);
  return NextResponse.json(article);
});