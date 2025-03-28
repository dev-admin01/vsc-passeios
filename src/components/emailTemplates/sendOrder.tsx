import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
  id_order?: string;
  previewText?: string;
}

export const sendOrder = ({
  id_order,
  previewText = "TESTE RESEND TTESTANDO ENVIOU COM LINK",
}: VercelInviteUserEmailProps) => {
  let urlDoc;
  let urlPDF;

  const docPath = "orderdocumentation";
  const pdfPath = "orders/pdf";

  if (process.env.NODE_ENV === "production") {
    const baseUrl = "https://vscpasseios.com.br";
    urlDoc = `${baseUrl}/${docPath}/${id_order}`;
    urlPDF = `${baseUrl}/${pdfPath}/${id_order}`;
  } else {
    const baseUrl = "http://localhost:3001";
    urlDoc = `${baseUrl}/${docPath}/${id_order}`;
    urlPDF = `${baseUrl}/${pdfPath}/${id_order}`;
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>VSC PASSEIOS</strong>
            </Heading>
            <Text className="text-lg ">{previewText}</Text>
            <Link href={`${urlDoc}`}>LINK PARA DOCUMENTOS</Link>
            <Link href={`${urlPDF}`}>VER PDF</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default sendOrder;
