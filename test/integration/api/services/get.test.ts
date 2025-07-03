import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/services", () => {
  test("with pagination", async () => {
    // Criar alguns services para os testes
    for (let i = 1; i <= 20; i++) {
      const serviceData = {
        description: `Passeio de Teste ${i}`,
        type: i % 2 === 0 ? "0" : "1",
        price: `${10000 + i * 1000}`,
        time: [`0${7 + i}:00`],
        observation: `Observação teste ${i}`,
      };

      await fetch("http://localhost:3000/api/services", {
        method: "POST",
        body: JSON.stringify(serviceData),
      });
    }

    const response = await fetch("http://localhost:3000/api/services");
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.services)).toBe(true);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(10);
    expect(responseBody.totalCount).toBe(20);
    expect(responseBody.lastPage).toBe(2);
    expect(responseBody.services.length).toBe(10);

    // Verifica se os services têm a estrutura esperada
    const firstService = responseBody.services[0];
    expect(firstService).toEqual({
      id_service: firstService.id_service,
      description: firstService.description,
      type: firstService.type,
      price: firstService.price,
      time: firstService.time,
      observation: firstService.observation,
      created_at: firstService.created_at,
      updated_at: firstService.updated_at,
    });

    expect(typeof firstService.id_service).toBe("number");
    expect(Date.parse(firstService.created_at)).not.toBeNaN();
    expect(Date.parse(firstService.updated_at)).not.toBeNaN();
  });

  test("with pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/services?page=1&perpage=3",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(3);
    expect(responseBody.services.length).toBeLessThanOrEqual(3);
    expect(responseBody.totalCount).toBeGreaterThan(0);
    expect(responseBody.lastPage).toBeGreaterThan(0);
  });

  test("with search parameter", async () => {
    const response = await fetch(
      "http://localhost:3000/api/services?search=Teste 1",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.services.length).toBeGreaterThan(0);
    expect(
      responseBody.services.some((service: any) =>
        service.description.includes("Teste 1"),
      ),
    ).toBe(true);
  });

  test("with search case insensitive", async () => {
    const response = await fetch(
      "http://localhost:3000/api/services?search=teste",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.services.length).toBeGreaterThan(0);
    expect(
      responseBody.services.every((service: any) =>
        service.description.toLowerCase().includes("teste"),
      ),
    ).toBe(true);
  });

  test("with search in observation", async () => {
    const response = await fetch(
      "http://localhost:3000/api/services?search=observação",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.services.length).toBeGreaterThan(0);
    expect(
      responseBody.services.every((service: any) =>
        service.observation.toLowerCase().includes("observação"),
      ),
    ).toBe(true);
  });

  test("with empty search result", async () => {
    const response = await fetch(
      "http://localhost:3000/api/services?search=INEXISTENTE",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.services.length).toBe(0);
    expect(responseBody.totalCount).toBe(0);
    expect(responseBody.lastPage).toBe(0);
  });
});
