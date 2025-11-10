import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isProtected = req.nextUrl.pathname.startsWith("/admin/salon-dashboard");

  if (isProtected && !token) {
    const referer = req.headers.get("referer") || "";
    if (!referer.includes("/sign-in")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/salon-dashboard/:path*"],
};
