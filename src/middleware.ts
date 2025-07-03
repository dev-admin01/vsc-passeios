import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import authentication from "./models/authentication";

export async function middleware(req: NextRequest) {
  if (process.env.TESTING_MODE) {
    return NextResponse.next();
  }
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/logo.png") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/api/sessions") ||
    req.nextUrl.pathname.startsWith("/api/status") ||
    req.nextUrl.pathname.startsWith("/api/migrations")
  ) {
    return NextResponse.next();
  }

  const token = await getCookieServer();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isValid = await validateToken(token);

  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

async function validateToken(token: string) {
  try {
    const isValid = await authentication.validateToken(token);
    return isValid;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/:path*"],
};
