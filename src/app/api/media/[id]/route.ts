import { NextRequest, NextResponse } from "next/server";
import { mediaController } from "@/api/controllers/media.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    await mediaController.delete(user, id);
    return NextResponse.json({ message: "Media deleted" });
});

export const GET = async (req: NextRequest, user: any) => {
    const id = Number(new URL(req.url).pathname.split("/").pop());
    const media = await mediaController.findById(id);
    return NextResponse.json(media);
};