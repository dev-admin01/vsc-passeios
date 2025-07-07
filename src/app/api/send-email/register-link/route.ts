import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendRegisterLink } from "@/components/emailTemplates/sendRegisterLink";
import { getCookieclient } from "@/lib/cookieClient";
import order from "@/models/order";

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
    };

    let emailTo = orderObj.pre_email;
    if (orderObj.customer) {
      emailTo = orderObj.customer.email;
    }

    const { data, error } = await resend.emails.send({
      from: "VSC passeios <no-reply@vscpasseios.com.br>",
      to: emailTo,
      subject: `Cadastro de dados e envio de comprovantes - ORC Nº ${orderObj.order_number}`,
      react: sendRegisterLink(orderObj),
    });

    await order.updateStatus(id_order, 5);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
