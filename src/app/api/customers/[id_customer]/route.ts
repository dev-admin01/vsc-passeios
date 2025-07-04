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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> }
) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { id_customer } = await params;
    const customerFound = await customer.findOneById(id_customer);

    return NextResponse.json(customerFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> }
) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { id_customer } = await params;
    const customerInputValues = await request.json();

    const updatedCustomer = await customer.updateById(
      id_customer,
      customerInputValues
    );

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> }
) {
  try {
    // Verificar autenticação
    await verifyAuthentication();

    const { id_customer } = await params;
    const deletedCustomer = await customer.deleteById(id_customer);

    return NextResponse.json(deletedCustomer, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
