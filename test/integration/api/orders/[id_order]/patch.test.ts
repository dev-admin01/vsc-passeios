import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/orders/[id_order]", () => {
  test("with valid id and complete data", async () => {
    // Criar um order primeiro
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Original",
      pre_email: "original@teste.com",
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

    // Atualizar o order
    const updateData = {
      id_user: "1",
      pre_name: "Cliente Atualizado",
      pre_email: "atualizado@teste.com",
      pre_cpf_cnpj: "98765432100",
      pre_ddi: "55",
      pre_ddd: "21",
      pre_phone: "888777666",
      time: "10:00",
      services: [
        {
          id_service: 1,
          price: "15000",
          quantity: 2,
          discount: 10,
        },
        {
          id_service: 2,
          price: "20000",
          quantity: 1,
          discount: 5,
        },
      ],
    };

    const updateResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );

    const updateResponseBody = await updateResponse.json();

    expect(updateResponse.status).toBe(200);
    expect(updateResponseBody).toHaveProperty("id_order", orderId);
    expect(updateResponseBody.pre_name).toBe("Cliente Atualizado");
    expect(updateResponseBody.pre_email).toBe("atualizado@teste.com");
    expect(updateResponseBody.pre_cpf_cnpj).toBe("98765432100");
    expect(updateResponseBody.pre_ddi).toBe("55");
    expect(updateResponseBody.pre_ddd).toBe("21");
    expect(updateResponseBody.pre_phone).toBe("888777666");
    expect(updateResponseBody.time).toBe("10:00");
    expect(Array.isArray(updateResponseBody.orders_service)).toBe(true);
    expect(updateResponseBody.orders_service.length).toBe(2);
  });

  test("with partial data update", async () => {
    // Criar um order primeiro
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Para Atualizar Parcial",
      pre_email: "parcial@teste.com",
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

    // Atualizar apenas alguns campos
    const updateData = {
      pre_name: "Nome Atualizado",
      pre_cpf_cnpj: "11122233344",
    };

    const updateResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );

    const updateResponseBody = await updateResponse.json();

    expect(updateResponse.status).toBe(200);
    expect(updateResponseBody.pre_name).toBe("Nome Atualizado");
    expect(updateResponseBody.pre_cpf_cnpj).toBe("11122233344");
    expect(updateResponseBody.pre_email).toBe("parcial@teste.com"); // Deve manter o valor original
    expect(updateResponseBody.pre_phone).toBe("11999887766"); // Deve manter o valor original
  });

  test("with invalid id", async () => {
    const updateData = {
      pre_name: "Cliente com ID Inválido",
    };

    const updateResponse = await fetch(
      "http://localhost:3000/api/orders/00000000-0000-0000-0000-000000000000",
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );

    const updateResponseBody = await updateResponse.json();

    expect(updateResponse.status).toBe(404);
    expect(updateResponseBody).toEqual({
      name: "NotFoundError",
      message: "O pedido não foi encontrado no sistema.",
      action: "Verifique se o ID está correto.",
      status_code: 404,
    });
  });

  test("with empty data", async () => {
    // Criar um order primeiro
    const orderData = {
      id_user: "1",
      pre_name: "Cliente Para Testar Dados Vazios",
      pre_email: "vazio@teste.com",
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

    // Tentar atualizar com dados vazios
    const updateData = {};

    const updateResponse = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );

    const updateResponseBody = await updateResponse.json();

    expect(updateResponse.status).toBe(400);
    expect(updateResponseBody).toEqual({
      name: "ValidationError",
      message: "Pelo menos um campo deve ser informado para atualização.",
      action: "Informe os dados que deseja atualizar e tente novamente.",
      status_code: 400,
    });
  });
});
