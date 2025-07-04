import controller from "@/errors/controller";
import user from "@/models/user";
import authentication from "@/models/authentication";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

// Função para verificar autenticação
async function verifyAuthentication() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const decoded = await authentication.validateToken(token);
  if (!decoded) {
    throw new Error("Token inválido");
  }

  return decoded;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { id_user } = await params;
    const userFound = await user.findOneById(id_user);

    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  const { id_user } = await params;
  const userInputValues = await request.json();
  try {
    const userFound = await user.update(id_user, userInputValues);
    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { id_user } = await params;
    const deletedUser = await user.delete(id_user);

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
