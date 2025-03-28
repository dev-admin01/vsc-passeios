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
  let url;
  if (process.env.ENVIREMENT === "Production") {
    const baseUrl = "https://vscpasseios.com.br/orderdocumentation";
    url = `${baseUrl}/${id_order}`;
  } else {
    url = `http://localhost:3001/orderdocumentation/${id_order}`;
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
            <Link href={`${url}`}>Resumo orçamento LINK</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default sendOrder;
