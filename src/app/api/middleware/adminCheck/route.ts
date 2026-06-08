import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  // console.log("[AdminCheck] GET request received");

  const token = req.cookies.get("token")?.value;
  // console.log("[AdminCheck] Token:", token);

  if (!token) {
    // console.log("[AdminCheck] No token → 401 Not authenticated");
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload: any = jwt.verify(token, SECRET);
    // console.log("[AdminCheck] Payload:", payload);

    // if (payload.role === "USER") {
    //   // console.log("[AdminCheck] Role USER → logging out and redirect");
    //   const res = NextResponse.json({ message: "Access denied" }, { status: 403 });
    //   res.cookies.set("token", "", { maxAge: 0, path: "/" });
    //   return res;
    // }

    // console.log("[AdminCheck] Role allowed → ADMIN/EDITOR");
    return NextResponse.json({ message: "Authorized", user: payload }, { status: 200 });
  } catch (err) {
    // console.log("[AdminCheck] Invalid token → logging out", err);
    const res = NextResponse.json({ message: "Invalid token" }, { status: 401 });
    res.cookies.set("token", "", { maxAge: 0, path: "/" });
    return res;
  }
}