import { NextRequest, NextResponse } from "next/server";
import { studioProjectController } from "@/api/controllers/studioProject.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const studioProject = await studioProjectController.findById(id);
  return NextResponse.json(studioProject);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const updated = await studioProjectController.update(id, body, user);
  return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  await studioProjectController.delete(id, user);
  return NextResponse.json({ message: "studioProject deleted" }, { status: 200 });
});