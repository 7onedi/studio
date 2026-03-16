import { NextRequest, NextResponse } from "next/server";
import { categoryController } from "@/api/controllers/category.controller";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const query: Record<string, string> = {};
	url.searchParams.forEach((v, k) => {
		query[k] = v;
	});

	const filters: Record<string, any> = {};
	if (query.name) filters.name = query.name;
  const options = {
    page: Number(query.page ?? 1),
    limit: Number(query.limit ?? 10),
    sortBy: query.sortBy ?? "createdAt",
    order: query.order === "asc" ? "asc" : "desc",
  };

  const result = await categoryController.search(filters, options);

  return NextResponse.json(result);
}