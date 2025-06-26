const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  await prisma.position.createMany({
    data: [
      { description: "manager" },
      { description: "Admin" },
      { description: "seller" },
      { description: "operator" },
    ],
    // Caso já existam dados, esse parâmetro evita duplicatas
    skipDuplicates: true,
  });

  const password = "senha123";
  const passwordHash = await hash(password, 8);

  if (process.env.NODE_ENV !== "test") {
    await prisma.user.createMany({
      data: [
        {
          name: "teste",
          email: "teste@teste.com",
          password: passwordHash,
          id_position: 1,
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        },
        {
          name: "seller",
          email: "seller@teste.com",
          password: passwordHash,
          id_position: 3,
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        },
      ],
      // Caso já existam dados, esse parâmetro evita duplicatas
      skipDuplicates: true,
    });
  }

  await prisma.orderStatus.createMany({
    data: [
      { description: "Aguardando envio" },
      { description: "Enviado ao Cliente" },
      { description: "Aprovado pelo cliente" },
      { description: "Reprovado pelo cliente" },
      { description: "Aguardando comprovantes" },
      { description: "Comprovantes recebidos" },
      { description: "Cancelado" },
      { description: "Enviar contrato e recibo" },
      { description: "Aguardando assinatura" },
      { description: "Compra finalizada" },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
