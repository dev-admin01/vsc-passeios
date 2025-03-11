import { version as uuidVersion } from "uuid";
import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: "user teste",
          email: "teste@teste.com",
          password: "123123",
          id_position: "1",
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id_user: responseBody.id_user,
        name: "user teste",
        email: "teste@teste.com",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999999999",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_user)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("with duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: "user teste",
          email: "teste1@teste.com",
          password: "123123",
          id_position: "1",
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: "user teste",
          email: "Teste1@teste.com",
          password: "123123",
          id_position: "1",
          ddi: "55",
          ddd: "11",
          phone: "999999999",
        }),
      });

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "utilize outro email para realizar o cadastro.",
        status_code: 400,
      });
      expect(response2.status).toBe(400);
    });
  });
});
