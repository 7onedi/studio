import { NextResponse } from "next/server";
import { tagController } from "@/api/controllers/tag.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET() {
    const tags = await tagController.list();
    return NextResponse.json(tags);
}

export const POST = withAuth(async (req, user) => {
    const body = await req.json();
    const tag = await tagController.create(body, user);
    return NextResponse.json(tag, { status: 201 });
});