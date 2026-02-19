import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER_AUTH_COOKIE = "user_auth";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname !== "/checkout" && !pathname.startsWith("/checkout/")) {
    return NextResponse.next();
  }

  const hasAuth = request.cookies.get(USER_AUTH_COOKIE)?.value === "1";
  if (!hasAuth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/checkout/:path*"],
};
