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
    req.nextUrl.pathname.startsWith("/pdf/receipt")
  ) {
    return NextResponse.next();
  }

  const token = await getCookieServer();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = await validateToken(token);

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Remover verificação de posição do middleware
  // A verificação de permissões será feita nas páginas individuais
  return NextResponse.next();
}

async function validateToken(token: string): Promise<string | false> {
  try {
    const userId = await authentication.validateToken(token);

    if (!userId) {
      return false;
    }

    return userId as string;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

export const config = {
  matcher: ["/:path*"],
};
