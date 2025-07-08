import controller from "@/errors/controller";
import supplier from "@/models/supplier";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_supplier: string }> }
) {
  try {
    const { id_supplier } = await params;
    const supplierFound = await supplier.findOneById(id_supplier);

    return NextResponse.json(supplierFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_supplier: string }> }
) {
  try {
    const { id_supplier } = await params;
    const supplierInputValues = await request.json();

    const updatedSupplier = await supplier.updateById(
      id_supplier,
      supplierInputValues
    );

    return NextResponse.json(updatedSupplier, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_supplier: string }> }
) {
  try {
    const { id_supplier } = await params;
    const deletedSupplier = await supplier.deleteById(id_supplier);

    return NextResponse.json(deletedSupplier, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
