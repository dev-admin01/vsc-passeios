import { NextRequest, NextResponse } from "next/server";

import { getCookieServer } from "@/lib/cookieServer";
import { jwtVerify } from "jose";
import { api } from "./services/api";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // MIDDLEWARES PARA API
  if (pathname.includes("/api")) {
    if (
      pathname.startsWith("/_next") ||
      pathname === "/api/v1/users" ||
      pathname === "/api/v1/auth" ||
      pathname === "/api/v1/status"
    ) {
      return NextResponse.next();
    }

    const authToken = req.headers.get("authorization");

    if (!authToken) {
      return NextResponse.json("", { status: 400 });
    }

    const [, token] = authToken.split(" ");

    try {
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secretKey);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("user-id", String(payload.sub));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 401 }
      );
    }
  }

  if (
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/status"
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

  try {
    await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
