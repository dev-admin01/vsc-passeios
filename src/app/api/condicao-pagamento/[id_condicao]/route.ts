import { NextRequest, NextResponse } from "next/server";
import condicaoPagamento from "@/models/condicao-pagamento";
import controller from "@/errors/controller";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_condicao: string }> },
) => {
  try {
    const { id_condicao } = await params;
    const deletedCondicao = await condicaoPagamento.deleteById(id_condicao);
    return NextResponse.json(deletedCondicao);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_condicao: string }> },
) => {
  try {
    const { id_condicao } = await params;
    const condicaoInputValues = await request.json();

    const updatedCondicao = await condicaoPagamento.updateById(
      id_condicao,
      condicaoInputValues,
    );
    return NextResponse.json(updatedCondicao);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};
