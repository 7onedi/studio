import { NextRequest, NextResponse } from "next/server";
import { locationController } from "@/api/controllers/location.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const location = await locationController.findById(id);
  return NextResponse.json(location);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const updated = await locationController.update(id, body, user);
  return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  await locationController.delete(id, user);
  return NextResponse.json({ message: "location deleted" }, { status: 200 });
});