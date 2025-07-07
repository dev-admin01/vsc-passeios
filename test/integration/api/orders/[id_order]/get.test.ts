import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/orders/[id_order]", () => {
  test("with valid id", async () => {
    // Criar um order primeiro
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Para Buscar",
      pre_email: "cliente.buscar@teste.com",
      pre_cpf_cnpj: "12345678901",
      pre_phone: "11999887766",
      time: "08:00",
      services: [
        {
          id_service: 1,
          price: "10000",
          quantity: 1,
          discount: 0,
        },
      ],
    };

    const createResponse = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const createResponseBody = await createResponse.json();
    const orderId = createResponseBody.id_order;

    // Buscar o order
    const getResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
    );

    const getResponseBody = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getResponseBody).toHaveProperty("id_order", orderId);
    expect(getResponseBody).toHaveProperty("pre_name", orderData.pre_name);
    expect(getResponseBody).toHaveProperty("pre_email", orderData.pre_email);
    expect(getResponseBody).toHaveProperty(
      "pre_cpf_cnpj",
      orderData.pre_cpf_cnpj,
    );
    expect(getResponseBody).toHaveProperty("pre_phone", orderData.pre_phone);
    expect(getResponseBody).toHaveProperty("time", orderData.time);
    expect(getResponseBody).toHaveProperty("user");
    expect(getResponseBody).toHaveProperty("orders_service");
    expect(getResponseBody).toHaveProperty("created_at");
    expect(getResponseBody).toHaveProperty("updated_at");

    expect(Array.isArray(getResponseBody.orders_service)).toBe(true);
    expect(getResponseBody.orders_service.length).toBe(1);
    expect(typeof getResponseBody.id_order).toBe("string");
  });

  test("with invalid id", async () => {
    const getResponse = await fetch(
      "http://localhost:3000/api/orders/00000000-0000-0000-0000-000000000000",
    );

    const getResponseBody = await getResponse.json();

    expect(getResponse.status).toBe(404);
    expect(getResponseBody).toEqual({
      name: "NotFoundError",
      message: "O pedido não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });

  test("with malformed id", async () => {
    const getResponse = await fetch(
      "http://localhost:3000/api/orders/invalid-uuid",
    );

    const getResponseBody = await getResponse.json();

    expect(getResponse.status).toBe(404);
    expect(getResponseBody).toEqual({
      name: "NotFoundError",
      message: "O pedido não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });
});
