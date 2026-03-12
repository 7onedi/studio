import { NextRequest, NextResponse } from "next/server";
import { studioProjectController } from "@/api/controllers/studioProject.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const POST = withAuth(async (req: NextRequest, user: any) => {
    const body = await req.json();
    const studioProject = await studioProjectController.create(body, user);
    return NextResponse.json(studioProject, { status: 201 });
});