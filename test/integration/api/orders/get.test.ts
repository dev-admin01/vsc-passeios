import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/orders", () => {
  test("with pagination", async () => {
    // Criar alguns orders para os testes
    for (let i = 1; i <= 20; i++) {
      const orderData = {
        id_user: "1",
        pre_name: `Cliente Teste ${i}`,
        pre_email: `cliente${i}@teste.com`,
        pre_phone: `11999${i.toString().padStart(6, "0")}`,
        time: "08:00",
        services: [
          {
            id_service: 1,
            price: `${10000 + i * 1000}`,
            quantity: 1,
            discount: 0,
          },
        ],
      };

      await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    }

    const response = await fetch("http://localhost:3000/api/orders");
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.orders)).toBe(true);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(10);
    expect(responseBody.totalCount).toBe(20);
    expect(responseBody.lastPage).toBe(2);
    expect(responseBody.orders.length).toBe(10);

    // Verifica se os orders têm a estrutura esperada
    const firstOrder = responseBody.orders[0];
    expect(firstOrder).toHaveProperty("id_order");
    expect(firstOrder).toHaveProperty("pre_name");
    expect(firstOrder).toHaveProperty("pre_email");
    expect(firstOrder).toHaveProperty("pre_phone");
    expect(firstOrder).toHaveProperty("created_at");
    expect(firstOrder).toHaveProperty("updated_at");
    expect(firstOrder).toHaveProperty("user");
    expect(firstOrder).toHaveProperty("orders_service");

    expect(typeof firstOrder.id_order).toBe("string");
    expect(Date.parse(firstOrder.created_at)).not.toBeNaN();
    expect(Date.parse(firstOrder.updated_at)).not.toBeNaN();
  });

  test("with pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/orders?page=1&perpage=3",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(3);
    expect(responseBody.orders.length).toBeLessThanOrEqual(3);
    expect(responseBody.totalCount).toBeGreaterThan(0);
    expect(responseBody.lastPage).toBeGreaterThan(0);
  });

  test("with search parameter", async () => {
    const response = await fetch(
      "http://localhost:3000/api/orders?search=Teste 1",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.orders.length).toBeGreaterThan(0);
    expect(
      responseBody.orders.some((order: any) =>
        order.pre_name.includes("Teste 1"),
      ),
    ).toBe(true);
  });

  test("with search case insensitive", async () => {
    const response = await fetch(
      "http://localhost:3000/api/orders?search=cliente",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.orders.length).toBeGreaterThan(0);
    expect(
      responseBody.orders.every((order: any) =>
        order.pre_name.toLowerCase().includes("cliente"),
      ),
    ).toBe(true);
  });

  test("with search in email", async () => {
    const response = await fetch(
      "http://localhost:3000/api/orders?search=@teste.com",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.orders.length).toBeGreaterThan(0);
    expect(
      responseBody.orders.every((order: any) =>
        order.pre_email.toLowerCase().includes("@teste.com"),
      ),
    ).toBe(true);
  });

  test("with empty search result", async () => {
    const response = await fetch(
      "http://localhost:3000/api/orders?search=INEXISTENTE",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.orders.length).toBe(0);
    expect(responseBody.totalCount).toBe(0);
    expect(responseBody.lastPage).toBe(0);
  });
});
