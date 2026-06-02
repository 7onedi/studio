import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/api/utils/jwt";
import { userRepository } from "@/api/repositories/user.repository";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    const payload =
      verifyToken(token);

    const user =
      await userRepository.findById(
        payload.id
      );

    if (!user)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarId: user.avatarId,
      avatar: user.avatar,
    });

  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}