// Exemplo de rota em app/api/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import { Resend } from "resend";
import sendReceiptAndContract from "@/components/emailTemplates/sendReceiptAndContract";
import { getCookieclient } from "@/lib/cookieClient";

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

    const orderObj = {
      id_order: orderData.id_order,
      order_number: orderData.order_number,
      pre_name: orderData.pre_name,
      pre_email: orderData.pre_email,
      customer: orderData.customer,
      link_signature: orderData.link_signature,
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
