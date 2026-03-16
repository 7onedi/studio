import { NextResponse } from "next/server";
import swaggerJson from "@/swagger/swagger.json";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(swaggerJson);
}