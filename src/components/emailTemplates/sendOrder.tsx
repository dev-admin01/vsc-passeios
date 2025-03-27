import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
  name?: string;
  previewText?: string;
}

export const sendOrder = ({
  name = "",
  previewText = "TESTE RESEND",
}: VercelInviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>VSC PASSEIOS</strong> on <strong>{name}</strong>
            </Heading>
            <Text className="text-lg ">{previewText}</Text>
            CHURRAS BARBEBOI 25/04 TESTE TESTE TESTANDO SE AINDA VAI SPAN com
            no-reply
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default sendOrder;
