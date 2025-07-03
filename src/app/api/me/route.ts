import { NextResponse } from "next/server";

import authentication from "@/models/authentication";
import user from "@/models/user";
import { getCookieServer } from "@/lib/cookieServer";
import { UnauthorizedError } from "@/errors/errors";

export async function GET() {
  try {
    const token = await getCookieServer();

    if (!token) {
      throw new UnauthorizedError({
        message: "Validação de acesso falhou, efetue o login.",
        action: "Realize o login.",
      });
    }

    const validUserId = await authentication.validateToken(token);

    if (!validUserId) {
      throw new UnauthorizedError({
        message: "Validação de acesso falhou, efetue o login.",
        action: "Realize o login.",
      });
    }

    const userInfo = await user.findOneById(validUserId as string);

    const userData = {
      id_user: userInfo.id_user,
      name: userInfo.name,
      email: userInfo.email,
      id_position: userInfo.id_position,
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in /api/me:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
