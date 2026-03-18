import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";
import { withAuth } from "@/app/api/middleware/auth";

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const result = await partnerController.updateStatus(body, user);
  return NextResponse.json(result);
});