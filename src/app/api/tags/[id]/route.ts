import { NextRequest, NextResponse } from "next/server";
import { tagController } from "@/api/controllers/tag.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const tag = await tagController.findById(id);
    return NextResponse.json(tag);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const body = await req.json();
    const updated = await tagController.update(body, id, user);
    return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    await tagController.delete(id, user);
    return NextResponse.json({ message: "Tag deleted" });
});