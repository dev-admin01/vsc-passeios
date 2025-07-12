import controller from "@/errors/controller";
import documentosPDF from "@/models/documentos-pdf";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileNumber: string }> },
) {
  try {
    const { id, fileNumber } = await params;

    // Validar o número do arquivo
    if (!["1", "2", "3"].includes(fileNumber)) {
      return NextResponse.json(
        { message: "Número de arquivo inválido" },
        { status: 400 },
      );
    }

    // Buscar o documento
    const documento = await documentosPDF.findOneById(id);

    if (!documento) {
      return NextResponse.json(
        { message: "Documento não encontrado" },
        { status: 404 },
      );
    }

    // Obter o arquivo base64 correto
    const fieldName = `arquivo_${fileNumber}_base64` as keyof typeof documento;
    const fileBase64 = documento[fieldName] as string;

    if (!fileBase64) {
      return NextResponse.json(
        { message: "Arquivo não encontrado" },
        { status: 404 },
      );
    }

    // Converter base64 para buffer
    const base64Data = fileBase64.replace(/^data:application\/pdf;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Criar nome do arquivo
    const fileName = `${documento.nome}_arquivo_${fileNumber}.pdf`;

    // Retornar o arquivo PDF
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
