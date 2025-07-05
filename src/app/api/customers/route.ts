import controller from "@/errors/controller";
import customer from "@/models/customer";
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

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const customers = await customer.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const customerInputValues = await request.json();

    const newCustomer = await customer.create(customerInputValues);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
