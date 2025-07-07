import { NextRequest, NextResponse } from "next/server";
import order from "@/models/order";
import controller from "@/errors/controller";

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await order.sendContract(payload.id_order, payload.link_signature);
    return NextResponse.json(
      { message: "Contrato enviado com sucesso" },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
