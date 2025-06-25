import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/api/:path*"],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { api } from "./services/api";

// // Cache simples para tokens válidos
// const tokenCache = new Map<string, { isValid: boolean; timestamp: number }>();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Rotas públicas que não precisam de autenticação
//   if (
//     pathname.startsWith("/_next") ||
//     pathname === "/" ||
//     pathname === "/status" ||
//     pathname === "/logo.png" ||
//     pathname.startsWith("/orderdocumentation") ||
//     pathname.startsWith("/pdf")
//   ) {
//     return NextResponse.next();
//   }

//   // Obtém os cookies
//   const sessionCookie = req.cookies.get("vsc-session");
//   const identifyCookie = req.cookies.get("vsc-identify");

//   if (!sessionCookie?.value) {
//     console.log("Token de sessão não encontrado, redirecionando para login");
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   const isValid = await validateToken(sessionCookie.value);

//   if (!isValid) {
//     console.log("Token inválido, redirecionando para login");
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // Adiciona os cookies na resposta para garantir que eles sejam mantidos
//   const response = NextResponse.next();
//   response.cookies.set("vsc-session", sessionCookie.value, {
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//   });

//   if (identifyCookie?.value) {
//     response.cookies.set("vsc-identify", identifyCookie.value, {
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });
//   }

//   return response;
// }

// async function validateToken(token: string) {
//   if (!token) return false;

//   // Verifica se o token está no cache e ainda é válido
//   const cachedToken = tokenCache.get(token);
//   if (cachedToken && Date.now() - cachedToken.timestamp < CACHE_DURATION) {
//     return cachedToken.isValid;
//   }

//   try {
//     const response = await api.get("/api/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const isValid = response.status === 200;

//     // Atualiza o cache
//     tokenCache.set(token, {
//       isValid,
//       timestamp: Date.now(),
//     });

//     return isValid;
//   } catch (error) {
//     console.error("Erro ao validar token:", error);
//     return false;
//   }
// }
