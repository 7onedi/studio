import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/api/controllers/user.controller";
import { withAuth } from "@/app/api/middleware/auth";

export async function GET(req: NextRequest) {
  const id = Number(new URL(req.url).pathname.split("/").pop());

  const user = await userController.findById(id);

  return NextResponse.json(user);
}

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const id = Number(new URL(req.url).pathname.split("/").pop());

  const updated = await userController.update(id, body, user);

  return NextResponse.json(updated);
});