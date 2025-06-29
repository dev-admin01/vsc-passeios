import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

let testCondicaoId: string;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  // Criar uma condição para usar nos testes de atualização
  const condicaoData = {
    description: "Original",
    installments: "1",
    discount: "0",
  };

  const response = await fetch("http://localhost:3000/api/condicao-pagamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(condicaoData),
  });

  const responseBody = await response.json();
  testCondicaoId = responseBody.id_cond_pag;
});

describe("PATCH /api/condicao-pagamento/[id_condicao]", () => {
  test("with valid data", async () => {
    const updateData = {
      description: "Updated Payment Method",
      installments: "6",
      discount: "5",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${testCondicaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      id_cond_pag: testCondicaoId,
      description: "Updated Payment Method",
      installments: "6",
      discount: "5",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test("update installments and discount", async () => {
    const updateData = {
      description: "PIX Updated",
      installments: "1",
      discount: "10",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${testCondicaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.description).toBe("PIX Updated");
    expect(responseBody.installments).toBe("1");
    expect(responseBody.discount).toBe("10");
  });

  test("with duplicate description", async () => {
    // Criar outra condição primeiro
    const anotherCondicaoData = {
      description: "Another Method",
      installments: "3",
      discount: "0",
    };

    await fetch("http://localhost:3000/api/condicao-pagamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(anotherCondicaoData),
    });

    // Tentar atualizar a condição existente com descrição duplicada
    const updateData = {
      description: "Another Method",
      installments: "12",
      discount: "0",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${testCondicaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Descrição já cadastrada.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 400,
    });
  });

  test("with non-existent id", async () => {
    const updateData = {
      description: "Non-existent Method",
      installments: "1",
      discount: "0",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/00000000-0000-4000-8000-000000000000`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "Condição de pagamento não encontrada.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });

  test("without description", async () => {
    const updateData = {
      installments: "12",
      discount: "5",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${testCondicaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 400,
    });
  });

  test("with empty description", async () => {
    const updateData = {
      description: "",
      installments: "6",
      discount: "0",
    };

    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${testCondicaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 400,
    });
  });
});
