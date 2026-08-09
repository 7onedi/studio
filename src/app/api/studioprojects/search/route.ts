import { NextRequest, NextResponse } from "next/server";
import { studioProjectController } from "@/api/controllers/studioProject.controller";

function parseQuery(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters: Record<string, any> = {};

  if (searchParams.has("title"))       filters.title       = searchParams.get("title");
  if (searchParams.has("parentId"))    filters.parentId    = Number(searchParams.get("parentId"));
  if (searchParams.get("hasParent") === "true")  filters.parentId = { not: null };
  if (searchParams.get("hasParent") === "false") filters.parentId = null;
  if (searchParams.has("categoryId"))  filters.categoryId  = Number(searchParams.get("categoryId"));
  if (searchParams.has("subcategoryId")) filters.subcategoryId = Number(searchParams.get("subcategoryId"));

  if (searchParams.get("published") === "true")  filters.published = true;
  if (searchParams.get("published") === "false") filters.published = false;

  if (searchParams.has("markerType")) {
    filters.markerType = searchParams.get("markerType");
  } else if (searchParams.get("onlyMarkers") === "true") {
    filters.markerType = { not: null };
  } else if (searchParams.get("includeMarkers") !== "true") {
    filters.markerType = "null";
  }

  const options = {
    page:   Number(searchParams.get("page")  ?? 1),
    limit:  Number(searchParams.get("limit") ?? 10),
    sortBy: searchParams.get("sortBy") ?? "createdAt",
    order:  searchParams.get("order") === "asc" ? "asc" : "desc",
  } as const;

  return { filters, options };
}

export async function GET(req: NextRequest) {
  const { filters, options } = parseQuery(req);
  const results = await studioProjectController.search(filters, options);
  return NextResponse.json(results);
}