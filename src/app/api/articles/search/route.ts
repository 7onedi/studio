import { NextRequest, NextResponse } from "next/server";
import { articleController } from "@/api/controllers/article.controller";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);

    const filters: Record<string, string> = {};
    const query: Record<string, string> = {};

    url.searchParams.forEach((v, k) => {
        query[k] = v;
    });

    // fields for filtering
    if (query.title) filters.title = query.title;
    if (query.lang) filters.lang = query.lang;
    if (query.categoryId) filters.categoryId = query.categoryId;

    const results = await articleController.search(filters, query);

    return NextResponse.json(results);
}