import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("GET /api/status", () => {
  describe("Anonymous user", () => {
    test("Retriving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parseUpdatedAt = new Date(
        responseBody.status.updated_at,
      ).toISOString();
      expect(responseBody.status.updated_at).toEqual(parseUpdatedAt);

      expect(responseBody.status.dependencies.database.version).toEqual("16.0");

      expect(responseBody.status.dependencies.database.max_connections).toEqual(
        100,
      );

      expect(
        responseBody.status.dependencies.database.opened_connections,
      ).toEqual(1);
    });
  });
});
