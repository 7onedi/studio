import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/api/controllers/user.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const PATCH = withAuth(async (req: NextRequest, user: any) => {

  const body = await req.json();
  const id = Number(new URL(req.url).pathname.split("/")[3]);

  const updated = await userController.changeRole(
    id,
    body.role,
    user
  );

  return NextResponse.json(updated);

});