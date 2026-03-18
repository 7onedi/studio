import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await partnerController.create(body, undefined);
  return NextResponse.json(result, { status: 201 });
}