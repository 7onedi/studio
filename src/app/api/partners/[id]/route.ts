// src/app/api/partners/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await partnerController.findById(Number(params.id));
  if (!result) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const body = await req.json();
  const result = await partnerController.update(id, body, user);
  return NextResponse.json(result);
});

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  const id = Number(new URL(req.url).pathname.split("/").pop());
  const result = await partnerController.delete(id, user);
  return NextResponse.json(result);
});