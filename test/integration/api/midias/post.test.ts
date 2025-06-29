import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/midia", () => {
  test("with pagination", async () => {
    for (let i = 0; i < 5; i++) {
      const dataMidia = {
        description: `cadastroMidia${i + 1}`,
      };

      await fetch("http://localhost:3000/api/midia", {
        method: "POST",
        body: JSON.stringify(dataMidia),
      });
    }

    const response6 = await fetch("http://localhost:3000/api/midia");

    const responseBody = await response6.json();
    expect(Array.isArray(responseBody.midias)).toBe(true);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(10);
    expect(responseBody.totalCount).toBe(5);
    expect(responseBody.lastPage).toBe(1);

    expect(responseBody.midias[0]).toEqual({
      id_midia: responseBody.midias[0].id_midia,
      description: "cadastroMidia1",
      created_at: responseBody.midias[0].created_at,
      updated_at: responseBody.midias[0].updated_at,
    });
  });
  test("with empty data", async () => {
    const dataMidia = {
      description: "",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Dados enviados inválidos");
    expect(responseBody.name).toBe("ValidationError");
    expect(responseBody.action).toBe(
      "Ajuste os dados informados e tente novamente."
    );
    expect(responseBody.status_code).toBe(400);
  });

  test("with duplicate description", async () => {
    const dataMidia = {
      description: "midiaValida",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    const dataMidia2 = {
      description: "midiaValida",
    };

    const response2 = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia2),
    });

    expect(response2.status).toBe(400);
    const responseBody2 = await response2.json();
    expect(responseBody2.message).toBe("Descrição já cadastrada.");
    expect(responseBody2.name).toBe("ValidationError");
    expect(responseBody2.action).toBe(
      "Ajuste os dados informados e tente novamente."
    );
    expect(responseBody2.status_code).toBe(400);
  });

  test("with valid data", async () => {
    const dataMidia = {
      description: "cadastroMidia",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id_midia: responseBody.id_midia,
      description: "cadastroMidia",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(typeof responseBody.id_midia).toBe("number");
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });
});
