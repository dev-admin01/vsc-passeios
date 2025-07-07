import { NextRequest, NextResponse } from "next/server";
import order from "@/models/order";
import controller from "@/errors/controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_order: string }> },
) {
  try {
    const { id_order } = await params;
    const orderFound = await order.findOneById(id_order);

    const docsValidation = orderFound.order_documentation || [];

    return NextResponse.json(
      {
        message: "Documentos carregados com sucesso",
        docsValidation,
        status_code: 200,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
