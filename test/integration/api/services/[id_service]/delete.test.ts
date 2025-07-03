import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/services/[id_service]", () => {
  test("with valid id", async () => {
    // Criar um service primeiro
    const serviceData = {
      description: "Passeio Para Deletar",
      type: "1",
      price: "10000,99",
      time: ["08:00"],
      observation: "Observação para deletar",
    };

    const createResponse = await fetch("http://localhost:3000/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });

    const createResponseBody = await createResponse.json();
    const serviceId = createResponseBody.id_service;

    // Deletar o service
    const deleteResponse = await fetch(
      `http://localhost:3000/api/services/${serviceId}`,
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponseBody).toEqual({
      id_service: serviceId,
    });
  });

  test("with invalid id", async () => {
    const deleteResponse = await fetch(
      "http://localhost:3000/api/services/99999",
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponseBody).toEqual({
      name: "NotFoundError",
      message: "O serviço não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });
});
