import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/utils/jwt";
import { ApiError } from "@/api/utils/api-error";

/**
 * Функція-обгортка для App Router
 * @param handler - callback, який приймає user і NextRequest
 */
export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
    return async function (req: NextRequest) {
        try {
        const token = req.cookies.get("token")?.value;
        if (!token) throw new ApiError(401, "Unauthorized");

        const user = verifyToken(token); // { id, role }

        return await handler(req, user);
        } catch (err: any) {
        return NextResponse.json(
            { message: err.message || "Server error" },
            { status: err.status || 500 }
        );
        }
    };
}