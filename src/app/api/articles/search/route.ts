import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";
import { handleRouteError } from "@/api/utils/handle-route-error";

const toIdList = (v?: string) =>
  v ? v.split(",").map(Number).filter(Boolean) : [];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((v, k) => { query[k] = v; });

    const filters: Record<string, any> = {};
    if (query.title) filters.title = query.title;
    if (query.lang) filters.lang = query.lang;
    if (query.categoryId) filters.categoryId = Number(query.categoryId);
    if (query.excludeCategoryId) filters.excludeCategoryId = Number(query.excludeCategoryId);
    if (query.subcategoryId) filters.subcategoryId = Number(query.subcategoryId);
    if (query.tagId) filters.tagId = Number(query.tagId);
    if (query.categoryIds) filters.categoryIds = toIdList(query.categoryIds);
    if (query.subcategoryIds) filters.subcategoryIds = toIdList(query.subcategoryIds);
    if (query.tagIds) filters.tagIds = toIdList(query.tagIds);
    if (query.slider) filters.slider = query.slider;
    if (query.published === "true") filters.published = true;
    if (query.published === "false") filters.published = false;
    if (query.authorId) filters.authorId = Number(query.authorId);

    const options = {
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 10),
      sortBy: query.sortBy ?? "createdAt",
      order: query.order === "asc" ? "asc" : "desc",
    };

    const results = await articleController.search(filters, options);
    return NextResponse.json(results);
  } catch (error) {
    return handleRouteError(error);
  }
}