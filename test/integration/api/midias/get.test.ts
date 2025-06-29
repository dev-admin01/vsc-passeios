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
});
