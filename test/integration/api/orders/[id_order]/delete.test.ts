import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/orders/[id_order]", () => {
  test("with valid id", async () => {
    // Criar um order primeiro
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Para Deletar",
      pre_email: "deletar@teste.com",
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

    // Deletar o order
    const deleteResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponseBody).toEqual({
      id_order: orderId,
    });

    // Verificar se o order foi realmente deletado
    const getResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
    );

    expect(getResponse.status).toBe(404);
  });

  test("with invalid id", async () => {
    const deleteResponse = await fetch(
      "http://localhost:3000/api/orders/00000000-0000-0000-0000-000000000000",
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponseBody).toEqual({
      name: "NotFoundError",
      message: "O pedido não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });

  test("with malformed id", async () => {
    const deleteResponse = await fetch(
      "http://localhost:3000/api/orders/invalid-uuid",
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponseBody).toEqual({
      name: "NotFoundError",
      message: "O pedido não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });

  test("cascade deletion of related records", async () => {
    // Criar um order com múltiplos serviços
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Cascade Delete",
      pre_email: "cascade@teste.com",
      time: "08:00",
      services: [
        {
          id_service: 1,
          price: "10000",
          quantity: 1,
          discount: 0,
        },
        {
          id_service: 2,
          price: "15000",
          quantity: 2,
          discount: 5,
        },
      ],
    };

    const createResponse = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const createResponseBody = await createResponse.json();
    const orderId = createResponseBody.id_order;

    // Verificar que o order foi criado com serviços
    expect(createResponseBody.orders_service.length).toBe(2);

    // Deletar o order
    const deleteResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "DELETE",
      },
    );

    expect(deleteResponse.status).toBe(200);

    // Verificar se o order foi deletado
    const getResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
    );

    expect(getResponse.status).toBe(404);
  });
});
