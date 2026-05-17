import { NextRequest, NextResponse } from "next/server";
import { partnerController } from "@/api/controllers/partner.controller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, ...partnerData } = body;

    // верифікація капчі
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
    
    const result = await partnerController.create(body, undefined);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
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