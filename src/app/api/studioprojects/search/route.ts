import { NextRequest, NextResponse } from "next/server";
import { studioProjectController } from "@/api/controllers/studioProject.controller";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    query[k] = v;
  });

  const filters: Record<string, any> = {};
  if (query.title) filters.title = query.title;
  if (query.parentId) filters.parentId = Number(query.parentId);
  if (query.categoryId) filters.categoryId = Number(query.categoryId);
  if (query.subcategoryId) filters.subcategoryId = Number(query.subcategoryId);
  if (query.published === "true") filters.published = true;
  if (query.published === "false") filters.published = false;

  const options = {
    page: Number(query.page ?? 1),
    limit: Number(query.limit ?? 10),
    sortBy: query.sortBy ?? "createdAt",
    order: query.order === "asc" ? "asc" : "desc",
  };

  const results = await studioProjectController.search(filters, options);

  return NextResponse.json(results);
}