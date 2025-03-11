import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/status", () => {
  describe("Logged user", () => {
    test("List All services", async () => {
      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: "user teste",
          email: "teste@teste.com",
          password: "senhateste",
          id_position: "1",
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        }),
      });

      const response = await fetch("http://localhost:3000/api/v1/auth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "teste@teste.com",
          password: "senhateste",
        }),
      });
      const responseBody = await response.json();

      await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${responseBody.token}`,
        },
        body: JSON.stringify({
          description: "service 1",
          type: 0,
          price: 10.51,
          observation: "observacao service 1",
        }),
      });

      await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${responseBody.token}`,
        },
        body: JSON.stringify({
          description: "service 2",
          type: 1,
          price: 99.99,
          observation: "observacao service 2",
        }),
      });

      const response1 = await fetch(
        "http://localhost:3000/api/v1/services?page=1&limit=10&search",
        {
          headers: {
            Authorization: `Bearer ${responseBody.token}`,
          },
        }
      );
      const responseBody1 = await response1.json();

      expect(response1.status).toBe(200);

      expect(responseBody1[0]).toMatchObject({
        description: "service 1",
        type: "0",
        price: "10.51",
        observation: "observacao service 1",
      });
    });
  });
});
