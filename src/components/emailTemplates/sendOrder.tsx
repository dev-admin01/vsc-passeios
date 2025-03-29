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
  Img,
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
  let baseUrl;

  const docPath = "orderdocumentation";
  const pdfPath = "pdf";

  if (process.env.NODE_ENV === "production") {
    baseUrl = "https://vscpasseios.com.br";
    urlDoc = `${baseUrl}/${docPath}/${id_order}`;
    urlPDF = `${baseUrl}/${pdfPath}/${id_order}`;
  } else {
    baseUrl = "http://localhost:3001";
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
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="37"
              alt="Vercel"
              className="my-0 mx-auto"
            />
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>VSC PASSEIOS</strong>
            </Heading>
            <Text>
              Olá, [Nome do Cliente]! Que alegria poder ajudar você a planejar
              sua próxima aventura! Preparamos tudo com muito carinho e atenção
              para tornar esse processo o mais simples e inspirador possível.
              Confira abaixo os links que preparamos para você:
            </Text>
            <Text className="text-lg ">{previewText}</Text>
            <Link href={`${urlDoc}`}>LINK PARA DOCUMENTOS</Link>

            <br></br>
            <Link href={`${urlPDF}`}>VER PDF</Link>

            <Link href={"#"}>GUIAS</Link>

            <Text>
              Estamos super animados para fazer parte dessa jornada e ajudar a
              transformar seus sonhos em realidade. Se surgir qualquer dúvida ou
              se precisar de mais informações, estarei à disposição para ajudar
              no que for preciso. Um grande abraço e vamos juntos rumo a essa
              incrível viagem! Atenciosamente,
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default sendOrder;
