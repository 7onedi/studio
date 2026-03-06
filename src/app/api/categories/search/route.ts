import { NextRequest, NextResponse } from "next/server";
import { categoryController } from "@/api/controllers/category.controller";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const filters: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
        filters[k] = v;
    });

    const result = await categoryController.search(filters, filters);

    return NextResponse.json(result);
}