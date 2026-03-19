import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters: Record<string, any> = {};
  if (searchParams.has("role"))                  filters.role   = searchParams.get("role");
  if (searchParams.has("status"))                filters.status = searchParams.get("status");
  if (searchParams.get("published") === "true")  filters.published = true;
  if (searchParams.get("published") === "false") filters.published = false;

  const options = {
    page:   Number(searchParams.get("page")  ?? 1),
    limit:  Number(searchParams.get("limit") ?? 10),
    sortBy: searchParams.get("sortBy") ?? "createdAt",
    order:  searchParams.get("order") === "asc" ? "asc" : "desc",
  } as const;

  const result = await partnerController.search(filters, options);
  return NextResponse.json(result);
}