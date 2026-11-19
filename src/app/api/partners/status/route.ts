import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";
import { withAuth } from "@/app/api/middleware/auth";
import { sendMail } from "@/lib/mailer";
import { partnerStatus } from "@/lib/mail-templates";

export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const result = await partnerController.updateStatus(body, user);

  if (result?.email && (result.status === "APPROVED" || result.status === "REJECTED")) {
    const { subject, html } = partnerStatus(result.name, result.status === "APPROVED");
    try {
      await sendMail(result.email, subject, html);
    } catch (e) {
      console.error("Mail error:", e);
    }
  }

  return NextResponse.json(result);
});