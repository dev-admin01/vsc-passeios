// app/pdf/[id_order]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, renderToStream } from "@react-pdf/renderer";

type NodeReadableWithDestroy = NodeJS.ReadableStream & {
  destroy?: () => void;
};

export type paramsType = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  props: {
    params: paramsType;
  }
) {
  console.log("params", props.params);
  const { id } = await props.params;
  console.log("Gerando PDF para o pedido", id);

  const doc = (
    <Document>
      <Page>
        <Text>Olá, pedido de ID: {id}</Text>
      </Page>
    </Document>
  );

  const nodeStream = (await renderToStream(doc)) as NodeReadableWithDestroy;

  const webStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of nodeStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
    cancel() {
      // Se a stream tiver "destroy", chamamos.
      nodeStream.destroy?.();
    },
  });

  // 3) Retorna o PDF usando o Web ReadableStream
  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
