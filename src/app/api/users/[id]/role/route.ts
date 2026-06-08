import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/api/controllers/user.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const segments = new URL(req.url).pathname.split("/");
  const id = Number(segments[segments.length - 2]);

  // ✅ Заборона змінювати власну роль
  if (user.id === id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 403 });
  }

  if (body.role === 'OWNER') {
    return NextResponse.json({ error: "Cannot assign OWNER role" }, { status: 403 });
  }

  const result = await userController.changeRole(id, body.role, user);
  return NextResponse.json(result);
});