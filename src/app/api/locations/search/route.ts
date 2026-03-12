import { NextRequest, NextResponse } from "next/server";
import { locationController } from "@/api/controllers/location.controller";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    query[k] = v;
  });

  const filters: Record<string, any> = {};
  if (query.title) filters.title = query.title;
  if (query.lang) filters.lang = query.lang;
  if (query.categoryId) filters.categoryId = Number(query.categoryId);
  if (query.subcategoryId) filters.subcategoryId = Number(query.subcategoryId);
  if (query.published === "true") filters.studioProject = { published: true };
  if (query.published === "false") filters.studioProject = { published: false };

  const options = {
    page: Number(query.page ?? 1),
    limit: Number(query.limit ?? 10),
    sortBy: query.sortBy ?? "createdAt",
    order: query.order === "asc" ? "asc" : "desc",
  };

  const results = await locationController.search(filters, options);

  return NextResponse.json(results);
}