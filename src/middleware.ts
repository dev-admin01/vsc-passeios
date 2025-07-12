import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import { UnauthorizedError } from "@/errors/errors";

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
    req.nextUrl.pathname.startsWith("/api/migrations") ||
    req.nextUrl.pathname.startsWith("/api/orders/public") ||
    req.nextUrl.pathname.startsWith("/api/pdf") ||
    req.nextUrl.pathname.startsWith("/api/orders") ||
    req.nextUrl.pathname.startsWith("/api/receipt") ||
    req.nextUrl.pathname.startsWith("/pdf/receipt") ||
    req.nextUrl.pathname.startsWith("/pdf/order") ||
    req.nextUrl.pathname.startsWith("/api/documentos-pdf") ||
    req.nextUrl.pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Verifica token por Cookie OU por Bearer
  let token = await getCookieServer();

  if (!token) {
    // Tenta pegar do header Authorization
    const authHeader = req.headers.get("Authorization") || "";
    token = authHeader.split(" ")[1] || null;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = await validateToken(token);

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Adiciona user ID aos headers para uso nas rotas
  const response = NextResponse.next();
  response.headers.set("x-user-id", userId);
  return response;
}

async function validateToken(token: string): Promise<string | false> {
  try {
    const userId = await authentication.validateToken(token);
    return userId ? (userId as string) : false;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    throw new UnauthorizedError({
      message: "É necessário iniciar uma sessão.",
      action: "Efetue o login com suas credenciais.",
    });
  }
}

export const config = {
  matcher: ["/:path*"],
};
