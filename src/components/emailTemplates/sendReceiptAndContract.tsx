import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
  Link,
  Img,
} from "@react-email/components";
import * as React from "react";

import { EmailOrderProps } from "@/types/orders.type";

export const sendPDFOrderEmail = ({
  id_order,
  pre_name,
  customer,
  link_signature,
  pdfLinks,
}: EmailOrderProps & {
  pdfLinks?: Array<{ nome: string; url: string; fileName: string }>;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const urlPDF = `${baseUrl}/pdf/receipt/${id_order}`;

  let name = pre_name;
  if (customer) {
    name = customer?.nome || "";
  }

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Img
              src={`${baseUrl}/logo.png`}
              width="90"
              height="90"
              alt="logo-vsc-passeios"
              className="my-0 mx-auto"
            />
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Viajando San Andrés</strong>
            </Heading>
            <Text>
              Olá, {name ? toTitleCase(name.split(" ")[0]) : ""}! Estamos
              finalizando o fechamento do seu pedido, confira abaixo o link para
              assinatura do contrato e o seu recibo de pagamento:
            </Text>
            <Link href={`${link_signature}`}>Assinar contrato</Link>
            <br />
            <br />
            <Link href={`${urlPDF}`}>Recibo de pagamento</Link>

            {pdfLinks && pdfLinks.length > 0 && (
              <>
                <br />
                <br />
                <Text className="text-black text-[16px] font-semibold mb-2">
                  Documentos adicionais:
                </Text>
                {pdfLinks.map((link, index) => (
                  <div key={index} className="mb-2">
                    <Link href={link.url} className="text-blue-600 underline">
                      📄 {link.nome}
                    </Link>
                    <br />
                  </div>
                ))}
              </>
            )}

            <Text>
              Estamos super animados para fazer parte dessa jornada e ajudar a
              transformar seus sonhos em realidade. Se surgir qualquer dúvida ou
              se precisar de mais informações, estarei à disposição para ajudar
              no que for preciso. Um grande abraço e vamos juntos rumo a essa
              incrível viagem! Atenciosamente,
            </Text>
            <Text>Não responda esse e-mail</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default sendPDFOrderEmail;
