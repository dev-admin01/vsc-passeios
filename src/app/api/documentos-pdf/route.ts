import controller from "@/errors/controller";
import documentosPDF from "@/models/documentos-pdf";
import { NextRequest, NextResponse } from "next/server";

// Configuração específica para esta rota
export const runtime = "nodejs";
export const maxDuration = 60; // 60 segundos timeout

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
    // Verificar se o request tem um body muito grande
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) {
      // 4.5MB
      return NextResponse.json(
        {
          message: "Payload muito grande. Tamanho máximo permitido: 4.5MB",
          error: "PAYLOAD_TOO_LARGE",
        },
        { status: 413 },
      );
    }

    const documentoInputValues = await request.json();

    // Validar tamanho total dos arquivos base64
    const totalSize =
      (documentoInputValues.arquivo_1_base64?.length || 0) +
      (documentoInputValues.arquivo_2_base64?.length || 0) +
      (documentoInputValues.arquivo_3_base64?.length || 0);

    if (totalSize > 4.5 * 1024 * 1024) {
      // 4.5MB total
      return NextResponse.json(
        {
          message: "Arquivos muito grandes. Tamanho total máximo: 4.5MB",
          error: "FILES_TOO_LARGE",
        },
        { status: 413 },
      );
    }

    const newDocumento = await documentosPDF.create(documentoInputValues);
    return NextResponse.json(newDocumento, { status: 201 });
  } catch (error: any) {
    // Tratar especificamente erro de payload muito grande
    if (error.type === "entity.too.large" || error.status === 413) {
      return NextResponse.json(
        {
          message:
            "Arquivo muito grande. Reduza o tamanho dos arquivos PDF e tente novamente.",
          error: "PAYLOAD_TOO_LARGE",
        },
        { status: 413 },
      );
    }

    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
