import { NextResponse } from "next/server";
import { authController } from "@/api/controllers/auth.controller";
import { signToken } from "@/api/utils/jwt";
import { ApiError } from "@/api/utils/api-error";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Password from request:", body.password);
    const { user: userData } = await authController.login(body);

    const token = signToken({
      id: userData.id,
      role: userData.role,
    });

    const response = NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {

    if (err instanceof ApiError)
      return NextResponse.json(
        {
          message:
            err.message,
          errors:
            err.errors
        },
        {
          status:
            err.status
        }
      );

    return NextResponse.json(
      {
        message:
          "Server error"
      },
      {
        status: 500
      }
    );
  }
}