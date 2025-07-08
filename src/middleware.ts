import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import authentication from "./models/authentication";

export async function middleware(req: NextRequest) {
  // if (process.env.TESTING_MODE || process.env.NODE_ENV === "development") {
  //   return NextResponse.next();
  // }

  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/logo.png") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/api/sessions") ||
    req.nextUrl.pathname.startsWith("/api/status") ||
    req.nextUrl.pathname.startsWith("/api/migrations") ||
    req.nextUrl.pathname.startsWith("/api/orders/public") ||
    req.nextUrl.pathname.startsWith("/api/pdf") ||
    req.nextUrl.pathname.startsWith("/api/orders") ||
    req.nextUrl.pathname.startsWith("/api/receipt") ||
    req.nextUrl.pathname.startsWith("/pdf/receipt") ||
    req.nextUrl.pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  let token = null;

  token = await getCookieServer();

  let response: NextResponse | null = null;

  if (!token) {
    const mobileResult = await mobileToken(req);
    token = mobileResult.token;
    response = mobileResult.response;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = await validateToken(token as string);

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Remover verificação de posição do middleware
  // A verificação de permissões será feita nas páginas individuais
  return NextResponse.next();
}

async function mobileToken(req: NextRequest) {
  const bearerToken = req.headers.get("Authorization");
  const token = bearerToken?.split(" ")[1] || null;

  if (!token) {
    return { token: null, response: null };
  }

  const response = NextResponse.next();
  response.cookies.set("vsc-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return { token, response };
}

async function validateToken(token: string): Promise<string | false> {
  try {
    const userId = await authentication.validateToken(token);
    return userId ? (userId as string) : false;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/:path*"],
};
