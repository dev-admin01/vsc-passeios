import { NextResponse } from "next/server";
import order from "@/models/order";
import controller from "@/errors/controller";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_order: string }> },
) {
  try {
    const { id_order } = await params;

    const orderPdfData = await order.findOneById(id_order);

    return NextResponse.json({ orderPdfData }, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
