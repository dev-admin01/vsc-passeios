import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET to /api/v1/migrations sould return 200", () => {
  test("Logged user", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations");

    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });
});
