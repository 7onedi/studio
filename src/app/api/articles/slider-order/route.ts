import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const PUT = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const result = await articleController.updateSliderOrder(body, user);
  return NextResponse.json(result);
});