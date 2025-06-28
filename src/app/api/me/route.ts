import { NextResponse } from "next/server";
import authentication from "@/models/authentication";
import user from "@/models/user";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 },
      );
    }

    const decoded = await authentication.validateToken(token);

    if (!decoded || typeof decoded !== "object" || !("sub" in decoded)) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const userId = decoded.sub as string;
    const userFound = await user.findOneById(userId);

    if (!userFound) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Retorna apenas dados seguros (sem senha)
    const safeUser = {
      name: userFound.name,
      email: userFound.email,
      id_user: userFound.id_user,
      id_position: userFound.id_position,
      ddi: userFound.ddi,
      ddd: userFound.ddd,
      phone: userFound.phone,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
