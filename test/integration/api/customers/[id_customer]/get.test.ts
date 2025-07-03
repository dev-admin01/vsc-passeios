import { version as uuidVersion } from "uuid";
import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/customers/[id_customer]", () => {
  describe("Anonymous user", () => {
    test("should return 401 unauthorized", async () => {
      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
      );

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.message).toBe("Token não encontrado");
    });
  });

  describe("Authenticated user", () => {
    test("should return customer with valid id", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
        rg: "123456789",
        razao_social: "João Silva ME",
        nome_fantasia: "João Serviços",
        ddi: "55",
        ddd: "11",
        telefone: "999999999",
        indicacao: "Cliente antigo",
      });

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          headers: {
            Cookie: auth.cookie,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id_customer: customer.id_customer,
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
        rg: "123456789",
        razao_social: "João Silva ME",
        nome_fantasia: "João Serviços",
        ddi: "55",
        ddd: "11",
        telefone: "999999999",
        indicacao: "Cliente antigo",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_customer)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("should return 404 with invalid id", async () => {
      const auth = await orchestrator.getAuthToken();

      const response = await fetch(
        "http://localhost:3000/api/customers/invalid-id",
        {
          headers: {
            Cookie: auth.cookie,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O cliente não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
        status_code: 404,
      });
    });

    test("should return 404 with non-existent UUID", async () => {
      const auth = await orchestrator.getAuthToken();

      const fakeUUID = "123e4567-e89b-12d3-a456-426614174000";

      const response = await fetch(
        `http://localhost:3000/api/customers/${fakeUUID}`,
        {
          headers: {
            Cookie: auth.cookie,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O cliente não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
        status_code: 404,
      });
    });
  });
});
