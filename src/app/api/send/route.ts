// Exemplo de rota em app/api/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendOrder } from "@/components/emailTemplates/sendOrder";

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    // Lê o JSON que você enviou no fetch (idData)
    const body = await req.json();
    // Aqui, body deve ter { id_order: string }
    const { id_order } = body;

    const response = await fetch(`${baseUrl}/api/orders/${id_order}`, {});
    const orderData = await response.json();

    const order = orderData.order;  

    let emailTo = order.pre_email;
    if (order.costumer) {
      emailTo = order.costumer.email;
    }

    const { data, error } = await resend.emails.send({
      from: "VSC passeios <no-reply@vscpasseios.com.br>",
      to: emailTo,
      subject: `Orçamentos de passeios Nº ${order.order_number}`,
      react: sendOrder({ id_order }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
