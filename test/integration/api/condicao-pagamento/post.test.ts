import { version as uuidVersion } from "uuid";
import orchestrator from "../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/condicao-pagamento", () => {
  describe("Create Condicao Pagamento integration test", () => {
    test("with valid data", async () => {
      const condicaoData = {
        description: "Cartão de Crédito",
        installments: "12",
        discount: "0",
      };

      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id_cond_pag: responseBody.id_cond_pag,
        description: "Cartão de Crédito",
        installments: "12",
        discount: "0",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_cond_pag)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("with pix payment", async () => {
      const condicaoData = {
        description: "PIX",
        installments: "1",
        discount: "5",
      };

      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.description).toBe("PIX");
      expect(responseBody.installments).toBe("1");
      expect(responseBody.discount).toBe("5");
    });

    test("with duplicate description", async () => {
      const condicaoData1 = {
        description: "Cartão Duplicado",
        installments: "6",
        discount: "0",
      };

      await fetch("http://localhost:3000/api/condicao-pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condicaoData1),
      });

      const condicaoData2 = {
        description: "Cartão Duplicado",
        installments: "12",
        discount: "2",
      };

      const response2 = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData2),
        },
      );

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Descrição já cadastrada.",
        action: "Ajuste os dados informados e tente novamente.",
        status_code: 400,
      });
    });

    test("without description", async () => {
      const condicaoData = {
        installments: "6",
        discount: "0",
      };

      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Descrição não informada.",
        action: "Informe uma descrição para realizar esta operação.",
        status_code: 400,
      });
    });

    test("with empty description", async () => {
      const condicaoData = {
        description: "",
        installments: "6",
        discount: "0",
      };

      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Descrição não informada.",
        action: "Informe uma descrição para realizar esta operação.",
        status_code: 400,
      });
    });

    test("with maximum installments", async () => {
      const condicaoData = {
        description: "Cartão 24x",
        installments: "24",
        discount: "0",
      };

      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(condicaoData),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.installments).toBe("24");
    });
  });
});
