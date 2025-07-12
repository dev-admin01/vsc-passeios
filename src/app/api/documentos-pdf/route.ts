import controller from "@/errors/controller";
import documentosPDF from "@/models/documentos-pdf";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const documentos = await documentosPDF.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(documentos, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const documentoInputValues = await request.json();

    const newDocumento = await documentosPDF.create(documentoInputValues);
    return NextResponse.json(newDocumento, { status: 201 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
