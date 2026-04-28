import { NextRequest, NextResponse } from "next/server";
import { categoryController } from "@/api/controllers/category.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const category = await categoryController.findById(id);
    return NextResponse.json(category);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
    const body = await req.json();
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const updated = await categoryController.update(id, body, user);
    return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    await categoryController.delete(id, user);
    return NextResponse.json({ message: "Category deleted" });
});