import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = request.nextUrl.pathname.startsWith(
    "/admin/authentication"
  );

  // Якщо це адмін маршрут і немає токена → редірект на логін
  if (isAdminRoute && !isAuthRoute && !token) {
    return NextResponse.redirect(
      new URL("/admin/authentication/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
