import { NextRequest, NextResponse } from "next/server";
import { categoryController } from "@/api/controllers/category.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
    const categories = await categoryController.list();
    return NextResponse.json(categories);
}

export const POST = withAuth(async (req: NextRequest, user: any) => {
    const body = await req.json();
    const category = await categoryController.create(body, user);
    return NextResponse.json(category, { status: 201 });
});