import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/midia/:id_midia", () => {
  test("with valid id", async () => {
    const dataMidia = {
      description: "midiasematualizar",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);

    const dataMidia2 = {
      description: "midiaAtualizada",
    };

    const responseUpdate = await fetch(
      `http://localhost:3000/api/midia/${responseBody.id_midia}`,
      {
        method: "PATCH",
        body: JSON.stringify(dataMidia2),
      }
    );

    expect(responseUpdate.status).toBe(200);
    const responseBodyUpdate = await responseUpdate.json();
    expect(responseBodyUpdate).toEqual({
      id_midia: responseBody.id_midia,
      description: "midiaAtualizada",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test("with valid id", async () => {
    const dataMidia = {
      description: "midiasematualizar",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);

    const responseUpdate = await fetch(
      `http://localhost:3000/api/midia/${responseBody.id_midia}`,
      {
        method: "PATCH",
        body: JSON.stringify(dataMidia),
      }
    );

    expect(responseUpdate.status).toBe(400);
    const responseBodyUpdate = await responseUpdate.json();
    expect(responseBodyUpdate).toEqual({
      name: "ValidationError",
      message: "Descrição já cadastrada.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 400,
    });
  });

  test("with invalid id", async () => {
    const dataMidia = {
      description: "midiasematualizar",
    };

    const responseUpdate = await fetch(`http://localhost:3000/api/midia/5`, {
      method: "PATCH",
      body: JSON.stringify(dataMidia),
    });

    expect(responseUpdate.status).toBe(404);
    const responseBodyUpdate = await responseUpdate.json();
    expect(responseBodyUpdate).toEqual({
      name: "NotFoundError",
      message: "Mídia não encontrada.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });
});
