import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/midia/:id_midia", () => {
  test("with valid id", async () => {
    const dataMidia = {
      description: "cadastroMidia",
    };

    const response = await fetch("http://localhost:3000/api/midia", {
      method: "POST",
      body: JSON.stringify(dataMidia),
    });

    const responseBody = await response.json();

    const responseDelete = await fetch(
      `http://localhost:3000/api/midia/${responseBody.id_midia}`,
      {
        method: "DELETE",
      }
    );

    expect(responseDelete.status).toBe(200);
    const responseBodyDelete = await responseDelete.json();
    expect(responseBodyDelete).toEqual({
      message: "Mídia deletada com sucesso.",
      status_code: 200,
    });
  });

  test("with invalid id", async () => {
    const responseDelete = await fetch(
      "http://localhost:3000/api/midia/12312313",
      {
        method: "DELETE",
      }
    );

    expect(responseDelete.status).toBe(404);
    const responseBodyDelete = await responseDelete.json();
    expect(responseBodyDelete).toEqual({
      name: "NotFoundError",
      message: "Mídia não encontrada.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });
});
