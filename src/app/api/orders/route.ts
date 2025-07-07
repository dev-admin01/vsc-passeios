import controller from "@/errors/controller";
import order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const orders = await order.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderInputValues = await request.json();
    console.log("orderInputValues controller", orderInputValues);
    const newOrder = await order.create(orderInputValues);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id_order, id_status_order } = await request.json();
    const updatedOrder = await order.updateStatus(id_order, id_status_order);
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
