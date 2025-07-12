import controller from "@/errors/controller";
import documentosPDF from "@/models/documentos-pdf";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const documentoFound = await documentosPDF.findOneById(id);

    return NextResponse.json(documentoFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const documentoInputValues = await request.json();

    const documentoFound = await documentosPDF.updateById(
      id,
      documentoInputValues,
    );
    return NextResponse.json(documentoFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedDocumento = await documentosPDF.deleteById(id);

    return NextResponse.json(deletedDocumento, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
