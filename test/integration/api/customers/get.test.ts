import orchestrator from "../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/customers", () => {
  describe("Authenticated user", () => {
    test("should return empty list when no customers", async () => {
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        customers: [],
        page: 1,
        perpage: 10,
        totalCount: 0,
        lastPage: 0,
      });
    });

    test("should return customers list", async () => {
      // Criar alguns customers de teste
      await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
      });

      await orchestrator.createCustomer({
        nome: "Maria Santos",
        email: "maria@example.com",
        cpf_cnpj: "98765432100",
      });

      const response = await fetch("http://localhost:3000/api/customers", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.customers).toHaveLength(2);
      expect(responseBody.totalCount).toBe(2);
      expect(responseBody.page).toBe(1);
      expect(responseBody.perpage).toBe(10);
      expect(responseBody.lastPage).toBe(1);
    });

    test("should return paginated results", async () => {
      // Criar mais customers
      for (let i = 0; i < 5; i++) {
        await orchestrator.createCustomer({
          nome: `Cliente ${i}`,
          email: `cliente${i}@example.com`,
          cpf_cnpj: `${i}23456789${i}`,
        });
      }

      const response = await fetch(
        "http://localhost:3000/api/customers?page=1&perpage=3",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.customers).toHaveLength(3);
      expect(responseBody.page).toBe(1);
      expect(responseBody.perpage).toBe(3);
      expect(responseBody.lastPage).toBe(3);
    });

    test("should filter by search term", async () => {
      await orchestrator.createCustomer({
        nome: "Pedro Buscável",
        email: "pedro@example.com",
        cpf_cnpj: "11111111111",
      });

      const response = await fetch(
        "http://localhost:3000/api/customers?search=Buscável",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.customers).toHaveLength(1);
      expect(responseBody.customers[0].nome).toBe("Pedro Buscável");
    });

    test("should return empty when search not found", async () => {
      const response = await fetch(
        "http://localhost:3000/api/customers?search=INEXISTENTE",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.customers).toEqual([]);
      expect(responseBody.totalCount).toBe(0);
      expect(responseBody.lastPage).toBe(0);
    });
  });
});
