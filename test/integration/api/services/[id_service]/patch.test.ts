import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/services/[id_service]", () => {
  test("with valid id and complete data", async () => {
    // Criar um service primeiro
    const serviceData = {
      description: "Passeio Original with complete data",
      type: "1",
      price: "10.000,99",
      time: ["08:00", "10:00"],
      observation: "Observação original",
    };

    const createResponse = await fetch("http://localhost:3000/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });

    const createResponseBody = await createResponse.json();
    const serviceId = createResponseBody.id_service;

    // Atualizar o service
    const updateData = {
      description: "Passeio Atualizado",
      type: "0",
      price: "15.000,99",
      time: ["09:00", "11:00", "14:00"],
      observation: "Observação atualizada",
    };

    const updateResponse = await fetch(
      `http://localhost:3000/api/services/${serviceId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );

    const updateResponseBody = await updateResponse.json();

    expect(updateResponse.status).toBe(200);

    expect(updateResponseBody).toEqual({
      id_service: serviceId,
      description: "Passeio Atualizado",
      type: "0",
      price: "15000,99",
      time: '["09:00","11:00","14:00"]',
      observation: "Observação atualizada",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  // test("with partial data update", async () => {
  //   // Criar um service primeiro
  //   const serviceData = {
  //     description: "Passeio Para Atualizar with partial data",
  //     type: "1",
  //     price: "10000",
  //     time: ["08:00", "10:00"],
  //     observation: "Observação original",
  //   };

  //   const createResponse = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const createResponseBody = await createResponse.json();
  //   const serviceId = createResponseBody.id_service;

  //   // Atualizar apenas alguns campos
  //   const updateData = {
  //     description: "Nova Descrição",
  //     price: "25000",
  //   };

  //   const updateResponse = await fetch(
  //     `http://localhost:3000/api/services/${serviceId}`,
  //     {
  //       method: "PATCH",
  //       body: JSON.stringify(updateData),
  //     }
  //   );

  //   expect(updateResponse.status).toBe(400);

  //   const updateResponseBody = await updateResponse.json();

  //   expect(updateResponseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Tipo não informado.",
  //     action: "Informe um tipo para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("with invalid id", async () => {
  //   const updateData = {
  //     description: "Passeio Atualizado with invalid id",
  //   };

  //   const updateResponse = await fetch(
  //     "http://localhost:3000/api/services/99999",
  //     {
  //       method: "PATCH",
  //       body: JSON.stringify(updateData),
  //     }
  //   );

  //   const updateResponseBody = await updateResponse.json();

  //   expect(updateResponse.status).toBe(404);
  //   expect(updateResponseBody).toEqual({
  //     name: "NotFoundError",
  //     message: "O serviço não foi encontrado no sistema.",
  //     action: "Verifique se o ID está correto.",
  //     status_code: 404,
  //   });
  // });

  // test("with empty data", async () => {
  //   // Criar um service primeiro
  //   const serviceData = {
  //     description: "Passeio Para Testar empty data",
  //     type: "1",
  //     price: "10000",
  //     time: ["08:00"],
  //     observation: "Observação teste",
  //   };

  //   const createResponse = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const createResponseBody = await createResponse.json();
  //   const serviceId = createResponseBody.id_service;

  //   // Tentar atualizar com dados vazios
  //   const updateData = {};

  //   const updateResponse = await fetch(
  //     `http://localhost:3000/api/services/${serviceId}`,
  //     {
  //       method: "PATCH",
  //       body: JSON.stringify(updateData),
  //     }
  //   );

  //   const updateResponseBody = await updateResponse.json();

  //   expect(updateResponse.status).toBe(400);
  //   expect(updateResponseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Todos os campos são obrigatórios.",
  //     action: "Ajuste os dados informados e tente novamente.",
  //     status_code: 400,
  //   });
  // });
});
