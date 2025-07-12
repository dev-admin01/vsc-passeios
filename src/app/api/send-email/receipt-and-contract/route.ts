// Exemplo de rota em app/api/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import { Resend } from "resend";
import sendReceiptAndContract from "@/components/emailTemplates/sendReceiptAndContract";
import { getCookieclient } from "@/lib/cookieClient";
import documentosPDF from "@/models/documentos-pdf";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_order } = body;
    const token = await getCookieclient();
    const response = await fetch(`${baseUrl}/api/orders/${id_order}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const orderData = await response.json();

    // Buscar documentos PDF disponíveis
    const documentos = await documentosPDF.findAll();

    // Criar links para download dos arquivos PDF
    const pdfLinks: Array<{ nome: string; url: string; fileName: string }> = [];

    documentos.forEach((doc) => {
      if (doc.arquivo_1_base64) {
        pdfLinks.push({
          nome: `${doc.nome} - Arquivo 1`,
          url: `${baseUrl}/api/documentos-pdf/download/${doc.id}/1`,
          fileName: `${doc.nome}_arquivo_1.pdf`,
        });
      }
      if (doc.arquivo_2_base64) {
        pdfLinks.push({
          nome: `${doc.nome} - Arquivo 2`,
          url: `${baseUrl}/api/documentos-pdf/download/${doc.id}/2`,
          fileName: `${doc.nome}_arquivo_2.pdf`,
        });
      }
      if (doc.arquivo_3_base64) {
        pdfLinks.push({
          nome: `${doc.nome} - Arquivo 3`,
          url: `${baseUrl}/api/documentos-pdf/download/${doc.id}/3`,
          fileName: `${doc.nome}_arquivo_3.pdf`,
        });
      }
    });

    const orderObj = {
      id_order: orderData.id_order,
      order_number: orderData.order_number,
      pre_name: orderData.pre_name,
      pre_email: orderData.pre_email,
      customer: orderData.customer,
      link_signature: orderData.link_signature,
      pdfLinks: pdfLinks,
    };

    let emailTo = orderObj.pre_email;
    if (orderObj.customer) {
      emailTo = orderObj.customer.email;
    }

    const { data, error } = await resend.emails.send({
      from: "VSC passeios <no-reply@vscpasseios.com.br>",
      to: emailTo,
      subject: `Contrato e recibo de pagamento Nº ${orderObj.order_number}`,
      react: sendReceiptAndContract(orderObj),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const GET = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
