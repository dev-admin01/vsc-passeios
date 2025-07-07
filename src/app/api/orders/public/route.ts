import { NextRequest, NextResponse } from "next/server";
import order from "@/models/order";
import controller from "@/errors/controller";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();

    await order.updateDocumentation(payload);

    return NextResponse.json(
      { message: "Documentação atualizada com sucesso" },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const GET = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
