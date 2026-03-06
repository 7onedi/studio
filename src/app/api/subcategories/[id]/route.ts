import { NextRequest, NextResponse } from "next/server";
import { subcategoryController } from "@/api/controllers/subcategory.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const data = await subcategoryController.findById(id);
    return NextResponse.json(data);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const body = await req.json();
    const updated = await subcategoryController.update(body, id , user);
    return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    await subcategoryController.delete(id, user);
    return NextResponse.json({ message: "Subcategory deleted" });
});