import { NextRequest, NextResponse } from "next/server";
import { subcategoryController } from "@/api/controllers/subcategory.controller";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const filters: Record<string, string> = {};

    url.searchParams.forEach((v, k) => {
        filters[k] = v;
    });

    const results = await subcategoryController.search(filters, filters);

    return NextResponse.json(results);
}