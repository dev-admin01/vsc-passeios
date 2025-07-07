import { NextResponse } from "next/server";
import order from "@/models/order";
import controller from "@/errors/controller";
import condicaoPagamento from "@/models/condicao-pagamento";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_orders: string }> },
) {
  try {
    const { id_orders } = await params;

    const orderPdfData = await order.findOneById(id_orders);

    const condPagData = await condicaoPagamento.findAllWithPagination({
      page: 1,
      perpage: 1,
      search: "pix",
    });

    return NextResponse.json(
      { orderPdfData, condPagData: condPagData.condicoesPagamento },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
