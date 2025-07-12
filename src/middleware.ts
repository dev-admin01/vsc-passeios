import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import { UnauthorizedError } from "@/errors/errors";
import { jwtVerify } from "jose";

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

  const userId = await validateTokenWithoutPrisma(token);

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Adiciona user ID aos headers para uso nas rotas
  const response = NextResponse.next();
  response.headers.set("x-user-id", userId);
  return response;
}

async function validateTokenWithoutPrisma(
  token: string,
): Promise<string | false> {
  try {
    const secret = hexToUint8Array(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.sub) {
      return false;
    }

    // Verifica diretamente no payload se o usuário está ativo
    if (payload.active !== true) {
      return false;
    }

    return payload.sub as string;
  } catch (error) {
    console.error("Erro ao validar token:", error);

    throw new UnauthorizedError({
      message: "É necessário iniciar uma sessão.",
      action: "Efetue o login com suas credenciais.",
    });
  }
}

function hexToUint8Array(hexString: string) {
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

export const config = {
  matcher: ["/:path*"],
};
