import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { partnerController } from "@/api/controllers/partner.controller";
import { verifyToken } from "@/api/utils/jwt";
import { userRepository } from "@/api/repositories/user.repository";
import { sendMail } from "@/lib/mailer";
import { partnerReceived, ownerNewPartner } from "@/lib/mail-templates";
import { emailDomainExists } from "@/lib/email-check";

export const runtime = "nodejs";

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.id);
    return user ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, ...partnerData } = body;

    const user = await getCurrentUser();
    const isAdminRequest = user?.role === "ADMIN" || user?.role === "OWNER";

    if (!isAdminRequest) {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { message: "Перевірка капчі не пройдена" },
          { status: 400 }
        );
      }

      if (!(await emailDomainExists(partnerData.email))) {
        return NextResponse.json(
          { message: "Невірна електронна адреса" },
          { status: 400 }
        );
      }
    }

    const result = await partnerController.create(partnerData, user?.id);

    if (!isAdminRequest && result?.email) {
      try {
        const toPartner = partnerReceived(result.name);
        const toOwner = ownerNewPartner(result);
        await Promise.all([
          sendMail(result.email, toPartner.subject, toPartner.html),
          sendMail(process.env.OWNER_EMAIL!, toOwner.subject, toOwner.html),
        ]);
      } catch (e) {
        console.error("Mail error:", e);
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Partner create error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json(
        { message: "Ця електронна адреса вже використовується" },
        { status: 409 }
      );
    }
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { message: "Невірні дані форми" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Щось пішло не так, спробуйте пізніше" },
      { status: 500 }
    );
  }
}