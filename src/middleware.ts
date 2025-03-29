import { NextRequest, NextResponse } from "next/server";
import { api } from "./services/api";

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
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isValid = await validateToken(token);

  if (!isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

async function validateToken(token: string) {
  if (!token) return false;

  const response = await api.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return true;
  }

  return false;
}
