import controller from "@/errors/controller";
import order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_order: string }> },
) {
  try {
    const { id_order } = await params;
    const orderFound = await order.findOneById(id_order);

    return NextResponse.json(orderFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_order: string }> },
) {
  try {
    const { id_order } = await params;
    const orderInputValues = await request.json();

    const updatedOrder = await order.updateById(id_order, orderInputValues);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_order: string }> },
) {
  try {
    const { id_order } = await params;
    const deletedOrder = await order.deleteById(id_order);

    return NextResponse.json(deletedOrder, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
