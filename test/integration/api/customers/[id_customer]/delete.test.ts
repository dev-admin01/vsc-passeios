import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/customers/[id_customer]", () => {
  describe("Anonymous user", () => {
    test("should return 401 unauthorized", async () => {
      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.message).toBe("Token não encontrado");
    });
  });

  describe("Authenticated user", () => {
    test("should delete customer with valid id", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
        rg: "123456789",
      });

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "DELETE",
          headers: {
            Cookie: auth.cookie,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        message: "Cliente deletado com sucesso.",
        id_customer: customer.id_customer,
      });
    });

    test("should return 404 with invalid id", async () => {
      const auth = await orchestrator.getAuthToken();

      const response = await fetch(
        "http://localhost:3000/api/customers/invalid-id",
        {
          method: "DELETE",
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
          method: "DELETE",
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

    test("should actually delete the customer from database", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "Cliente Para Deletar",
        email: "deletar@example.com",
      });

      // Primeiro, verificar se o customer existe
      const getResponse = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          headers: {
            Cookie: auth.cookie,
          },
        },
      );
      expect(getResponse.status).toBe(200);

      // Deletar o customer
      const deleteResponse = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "DELETE",
          headers: {
            Cookie: auth.cookie,
          },
        },
      );
      expect(deleteResponse.status).toBe(200);

      // Tentar buscar novamente - deve retornar 404
      const getAfterDeleteResponse = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          headers: {
            Cookie: auth.cookie,
          },
        },
      );
      expect(getAfterDeleteResponse.status).toBe(404);
    });
  });
});
