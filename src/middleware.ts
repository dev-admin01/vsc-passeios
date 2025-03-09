import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  console.log(host);

  if (
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/api/v1/users" ||
    pathname === "/api/v1/auth" ||
    pathname === "/api/v1/status"
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}
