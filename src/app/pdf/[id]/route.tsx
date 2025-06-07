// app/pdf/[id_order]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import OrderPDF from "@/components/pdf/orderPdf";

type NodeReadableWithDestroy = NodeJS.ReadableStream & {
  destroy?: () => void;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const { id } = await params;

  const response = await fetch(`${baseUrl}/api/pdf/order/${id}`, {});

  if (!response.ok) {
    return new NextResponse("Erro ao buscar dados.", { status: 500 });
  }
  const pdfData = await response.json();

  // Passe os dados que precisar para o componente do PDF
  const docElement = <OrderPDF pdfData={pdfData.pdfData} />;

  const nodeStream = (await renderToStream(
    docElement
  )) as NodeReadableWithDestroy;

  const webStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of nodeStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
    cancel() {
      nodeStream.destroy?.();
    },
  });

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
