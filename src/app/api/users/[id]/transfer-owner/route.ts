import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/api/controllers/user.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const POST = withAuth(async (req: NextRequest, user: any) => {
  const toId = Number(new URL(req.url).pathname.split("/")[3]);

  const result = await userController.transferOwnership(toId, user);

  return NextResponse.json(result);
});