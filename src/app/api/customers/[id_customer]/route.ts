import controller from "@/errors/controller";
import customer from "@/models/customer";
import { NextRequest, NextResponse } from "next/server";
import authentication from "@/models/authentication";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> },
) {
  try {
    // Verificar autenticação
    const cookieStore = request.cookies;
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 },
      );
    }

    await authentication.validateToken(token);

    const { id_customer } = await params;

    const customerFound = await customer.findOneById(id_customer);
    return NextResponse.json(
      {
        costumer: customerFound,
        status_code: 200,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> },
) {
  try {
    // Verificar autenticação
    const cookieStore = request.cookies;
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 },
      );
    }

    await authentication.validateToken(token);

    const customerInputValues = await request.json();
    const { id_customer } = await params;

    const updatedCustomer = await customer.updateById(
      id_customer,
      customerInputValues,
    );
    return NextResponse.json(
      {
        ...updatedCustomer,
        message: "Cliente atualizado com sucesso!",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_customer: string }> },
) {
  try {
    // Verificar autenticação
    const cookieStore = request.cookies;
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 },
      );
    }

    await authentication.validateToken(token);

    const { id_customer } = await params;

    const deletedCustomer = await customer.deleteById(id_customer);
    return NextResponse.json(deletedCustomer, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
