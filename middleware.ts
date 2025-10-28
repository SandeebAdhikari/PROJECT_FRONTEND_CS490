import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const protectedRoutes = ["/admin/salon-dashboard"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        // token expired -> redirect
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    } catch {
      // invalid token format -> redirect
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/salon-dashboard/:path*"],
};
