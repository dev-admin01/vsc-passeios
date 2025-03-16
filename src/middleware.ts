import { NextRequest, NextResponse } from "next/server";

import { getCookieServer } from "@/lib/cookieServer";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/status" ||
    pathname === "/logo.png"
  ) {
    return NextResponse.next();
  }
  const token = await getCookieServer();
  console.log("token middleware:", token);
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isValid = await validateToken(token);
  console.log("valido:", isValid);

  if (!isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

async function validateToken(token: string) {
  if (!token) return false;

  const response = await fetch(`http://localhost:3000/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return true;
  }

  return false;
}
