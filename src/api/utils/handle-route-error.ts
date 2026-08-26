// api/utils/handle-route-error.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

function isPrismaKnownError(
  error: unknown
): error is { code: string; meta?: { target?: unknown; field_name?: unknown } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string" &&
    (error as any).code.startsWith("P")
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, errors: error.errors },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Validation error", errors: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (isPrismaKnownError(error)) {
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: `Duplicate value: ${error.meta?.target}` },
        { status: 409 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { message: `Related record does not exist: ${error.meta?.field_name ?? "unknown field"}` },
        { status: 400 }
      );
    }
  }

  console.error(error);
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}