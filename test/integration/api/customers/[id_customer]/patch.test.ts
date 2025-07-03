import { version as uuidVersion } from "uuid";
import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/customers/[id_customer]", () => {
  describe("Anonymous user", () => {
    test("should return 401 unauthorized", async () => {
      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const updateData = {
        nome: "João Silva Updated",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.message).toBe("Token não encontrado");
    });
  });

  describe("Authenticated user", () => {
    test("should update customer with valid data", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
        rg: "123456789",
      });

      const updateData = {
        nome: "João Silva Updated",
        email: "joao.updated@example.com",
        cpf_cnpj: "98765432100",
        rg: "987654321",
        razao_social: "João Silva Updated ME",
        nome_fantasia: "João Serviços Updated",
        ddi: "55",
        ddd: "21",
        telefone: "888888888",
        indicacao: "Cliente atualizado",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id_customer: customer.id_customer,
        nome: "João Silva Updated",
        email: "joao.updated@example.com",
        cpf_cnpj: "98765432100",
        rg: "987654321",
        razao_social: "João Silva Updated ME",
        nome_fantasia: "João Serviços Updated",
        ddi: "55",
        ddd: "21",
        telefone: "888888888",
        indicacao: "Cliente atualizado",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_customer)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("should update customer with partial data", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "Maria Santos",
        email: "maria@example.com",
        cpf_cnpj: "11111111111",
      });

      const updateData = {
        nome: "Maria Santos Updated",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.nome).toBe("Maria Santos Updated");
      expect(responseBody.email).toBe("maria@example.com"); // Não mudou
      expect(responseBody.cpf_cnpj).toBe("11111111111"); // Não mudou
    });

    test("should return error when no data provided", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify({}),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Todos os campos são obrigatórios.",
        action: "Ajuste os dados informados e tente novamente.",
        status_code: 400,
      });
    });

    test("should return error when nome is empty", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const updateData = {
        nome: "",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Nome não informado.",
        action: "Informe um nome para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when email is empty", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const updateData = {
        email: "",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email não informado.",
        action: "Informe um email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when updating to duplicate email", async () => {
      const auth = await orchestrator.getAuthToken();

      // Criar dois customers
      const customer1 = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const customer2 = await orchestrator.createCustomer({
        nome: "Maria Santos",
        email: "maria@example.com",
      });

      // Tentar atualizar customer2 com o email do customer1
      const updateData = {
        email: "joao@example.com",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer2.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when updating to duplicate cpf_cnpj", async () => {
      const auth = await orchestrator.getAuthToken();

      // Criar dois customers
      const customer1 = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
        cpf_cnpj: "12345678901",
      });

      const customer2 = await orchestrator.createCustomer({
        nome: "Maria Santos",
        email: "maria@example.com",
        cpf_cnpj: "98765432100",
      });

      // Tentar atualizar customer2 com o CPF do customer1
      const updateData = {
        cpf_cnpj: "12345678901",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer2.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "CPF/CNPJ informado já está sendo utilizado.",
        action: "Utilize outro CPF/CNPJ para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return 404 with invalid id", async () => {
      const auth = await orchestrator.getAuthToken();

      const updateData = {
        nome: "João Silva Updated",
      };

      const response = await fetch(
        "http://localhost:3000/api/customers/invalid-id",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
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

    test("should normalize email to lowercase", async () => {
      const auth = await orchestrator.getAuthToken();

      const customer = await orchestrator.createCustomer({
        nome: "João Silva",
        email: "joao@example.com",
      });

      const updateData = {
        email: "JOAO.UPDATED@EXAMPLE.COM",
      };

      const response = await fetch(
        `http://localhost:3000/api/customers/${customer.id_customer}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: auth.cookie,
          },
          body: JSON.stringify(updateData),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.email).toBe("joao.updated@example.com");
    });
  });
});
