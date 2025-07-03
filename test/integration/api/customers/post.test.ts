import { version as uuidVersion } from "uuid";
import orchestrator from "../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/customers", () => {
  describe("Authenticated user", () => {
    test("should create customer with valid data", async () => {
      const customerData = {
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
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id_customer: responseBody.id_customer,
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

    test("should create customer with minimal data", async () => {
      const customerData = {
        nome: "Maria Santos",
        email: "maria@example.com",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "CPF/CNPJ não informado.",
        action: "Informe um CPF/CNPJ para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when nome is missing", async () => {
      const customerData = {
        email: "semNome@example.com",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Nome não informado.",
        action: "Informe um nome para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when email is missing", async () => {
      const customerData = {
        nome: "Sem Email",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email não informado.",
        action: "Informe um email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when email is duplicate", async () => {
      // Criar primeiro customer
      const customer = await orchestrator.createCustomer({
        nome: "Primeiro Cliente",
        email: "duplicado@example.com",
      });

      const customerData = {
        nome: "Segundo Cliente",
        email: "duplicado@example.com",
        cpf_cnpj: "12345678901",
        rg: "123456789",
        razao_social: "João Silva ME",
        nome_fantasia: "João Serviços",
        ddi: "55",
        ddd: "11",
        telefone: "999999999",
        indicacao: "Cliente antigo",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should return error when cpf_cnpj is duplicate", async () => {
      // Criar primeiro customer com CPF único
      await orchestrator.createCustomer({
        nome: "Primeiro Cliente",
        email: "primeiro-cpf@example.com",
        cpf_cnpj: "99999999999",
      });

      const customerData = {
        nome: "Segundo Cliente",
        email: "segundo-cpf@example.com",
        cpf_cnpj: "99999999999",
        rg: "123456789",
        razao_social: "João Silva ME",
        nome_fantasia: "João Serviços",
        ddi: "55",
        ddd: "11",
        telefone: "999999999",
        indicacao: "Cliente antigo",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "CPF/CNPJ informado já está sendo utilizado.",
        action: "Utilize outro CPF/CNPJ para realizar esta operação.",
        status_code: 400,
      });
    });

    test("should normalize email to lowercase", async () => {
      const customerData = {
        nome: "Cliente Maiusculo",
        email: "MAIUSCULO@EXAMPLE.COM",
        cpf_cnpj: "952.789.456-12",
        rg: "123666666",
        razao_social: "João Silva ME",
        nome_fantasia: "João Serviços",
        ddi: "55",
        ddd: "11",
        telefone: "999999999",
        indicacao: "Cliente antigo",
      };

      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.email).toBe("maiusculo@example.com");
    });
  });
});
