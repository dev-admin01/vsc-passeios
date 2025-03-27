import { sendOrder } from "@/components/emailTemplates/sendOrder";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "VSC passeios <no-reply@vscpasseios.com.br>",
      to: ["bruno.lima1504@gmail.com"],
      subject: "Testando envio de orçamento com no-reply",
      react: sendOrder({ name: "Bruno Lima" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
