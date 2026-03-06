import { NextRequest, NextResponse } from "next/server";
import { tagController } from "@/api/controllers/tag.controller";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const filters: Record<string, string> = {};

    url.searchParams.forEach((v, k) => {
        filters[k] = v;
    });

    const results = await tagController.search(filters, filters);

    return NextResponse.json(results);
}