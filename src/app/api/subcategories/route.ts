import { NextResponse } from "next/server";
import { subcategoryController } from "@/api/controllers/subcategory.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET() {
    const data = await subcategoryController.list();
    return NextResponse.json(data);
}

export const POST = withAuth(async (req, user) => {
    const body = await req.json();
    const subcategory = await subcategoryController.create(body, user);
    return NextResponse.json(subcategory, { status: 201 });
});