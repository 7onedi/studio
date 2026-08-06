import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";
import { withAuth } from "@/app/api/middleware/auth";
import { handleRouteError } from "@/api/utils/handle-route-error";
import { ApiError } from "@/api/utils/api-error";

function getIdFromUrl(req: NextRequest) {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid article id");
  }
  return id;
}

export async function GET(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    const article = await articleController.findById(id);
    if (!article) throw new ApiError(404, "Article not found");
    return NextResponse.json(article);
  } catch (error) {
    return handleRouteError(error);
  }
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  try {
    const id = getIdFromUrl(req);
    const body = await req.json();
    const updated = await articleController.update(id, body, user);
    return NextResponse.json(updated);
  } catch (error) {
    return handleRouteError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  try {
    const id = getIdFromUrl(req);
    await articleController.delete(id, user);
    return NextResponse.json({ message: "Article deleted" }, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
});