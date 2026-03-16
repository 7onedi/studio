import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/api/controllers/user.controller";

export async function GET(req: NextRequest) {

  const url = new URL(req.url);
  const filters: Record<string, any> = {};

  url.searchParams.forEach((value, key) => {
    filters[key] = value;
  });

  const users = await userController.search(filters);

  return NextResponse.json(users);
}