import { NextResponse } from "next/server";
import { authController } from "@/api/controllers/auth.controller";
import { ApiError } from "@/api/utils/api-error";
export async function POST(req: Request) {

  try {

    const body = await req.json();

    const result =
      await authController.register(body);

    return NextResponse.json(result);

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