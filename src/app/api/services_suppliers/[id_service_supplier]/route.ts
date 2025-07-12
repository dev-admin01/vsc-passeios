import controller from "@/errors/controller";
import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_service_supplier: string }> },
) {
  try {
    const { id_service_supplier } = await params;
    const serviceSupplier = await prismaClient.serviceSupplier.findUnique({
      where: { id_service_supplier: parseInt(id_service_supplier) },
      include: {
        service: true,
        supplier: true,
      },
    });

    if (!serviceSupplier) {
      return NextResponse.json(
        { message: "Associação não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(serviceSupplier, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_service_supplier: string }> },
) {
  try {
    const { id_service_supplier } = await params;

    const serviceSupplier = await prismaClient.serviceSupplier.findUnique({
      where: { id_service_supplier: parseInt(id_service_supplier) },
    });

    if (!serviceSupplier) {
      return NextResponse.json(
        { message: "Associação não encontrada" },
        { status: 404 },
      );
    }

    await prismaClient.serviceSupplier.delete({
      where: { id_service_supplier: parseInt(id_service_supplier) },
    });

    return NextResponse.json(
      { message: "Associação removida com sucesso" },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
