import { NextRequest, NextResponse } from "next/server";
import { locationController } from "@/api/controllers/location.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const POST = withAuth(async (req: NextRequest, user: any) => {
    const body = await req.json();
    const location = await locationController.create(body, user);
    return NextResponse.json(location, { status: 201 });
});