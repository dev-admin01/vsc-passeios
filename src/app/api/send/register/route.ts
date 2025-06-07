// Exemplo de rota em app/api/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendRegister } from "@/components/emailTemplates/sendRegister";
import { getCookieclient } from "@/lib/cookieClient";

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

    const order = {
      id_order: orderData.order.id_order,
      order_number: orderData.order.order_number,
      pre_name: orderData.order.pre_name,
      pre_email: orderData.order.pre_email,
      costumer: orderData.order.cosutmer,
    };

    let emailTo = order.pre_email;
    if (order.costumer) {
      emailTo = order.costumer.email;
    }

    const { data, error } = await resend.emails.send({
      from: "VSC passeios <no-reply@vscpasseios.com.br>",
      to: emailTo,
      subject: `Cadastro de dados e envio de comprovantes - ORC Nº ${order.order_number}`,
      react: sendRegister(order),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
