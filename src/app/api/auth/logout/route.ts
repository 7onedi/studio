import { NextResponse } from "next/server";
import { authController } from "@/api/controllers/auth.controller";

export async function POST() {

  await authController.logout();

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}