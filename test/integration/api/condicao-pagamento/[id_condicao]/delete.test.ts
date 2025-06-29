import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/condicao-pagamento/[id_condicao]", () => {
  test("with valid id", async () => {
    // Criar uma condição para deletar
    const condicaoData = {
      description: "To Be Deleted",
      installments: "1",
      discount: "0",
    };

    const createResponse = await fetch(
      "http://localhost:3000/api/condicao-pagamento",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condicaoData),
      },
    );

    const createResponseBody = await createResponse.json();
    const condicaoId = createResponseBody.id_cond_pag;

    // Deletar a condição
    const deleteResponse = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${condicaoId}`,
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponseBody).toEqual({
      message: "Condição de pagamento deletada com sucesso.",
      status_code: 200,
    });

    // Verificar se a condição foi realmente deletada tentando buscar
    const listResponse = await fetch(
      "http://localhost:3000/api/condicao-pagamento",
    );
    const listResponseBody = await listResponse.json();

    const deletedCondicao = listResponseBody.condicoesPagamento.find(
      (c: any) => c.id_cond_pag === condicaoId,
    );
    expect(deletedCondicao).toBeUndefined();
  });

  test("delete multiple payment methods", async () => {
    // Criar múltiplas condições
    const paymentMethods = [
      { description: "Delete Test 1", installments: "1", discount: "0" },
      { description: "Delete Test 2", installments: "3", discount: "5" },
      { description: "Delete Test 3", installments: "6", discount: "0" },
    ];

    const createdIds = [];

    for (const method of paymentMethods) {
      const response = await fetch(
        "http://localhost:3000/api/condicao-pagamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(method),
        },
      );
      const responseBody = await response.json();
      createdIds.push(responseBody.id_cond_pag);
    }

    // Deletar todas
    for (const id of createdIds) {
      const deleteResponse = await fetch(
        `http://localhost:3000/api/condicao-pagamento/${id}`,
        {
          method: "DELETE",
        },
      );
      expect(deleteResponse.status).toBe(200);
    }

    // Verificar se foram todas deletadas
    const listResponse = await fetch(
      "http://localhost:3000/api/condicao-pagamento",
    );
    const listResponseBody = await listResponse.json();

    for (const id of createdIds) {
      const deletedCondicao = listResponseBody.condicoesPagamento.find(
        (c: any) => c.id_cond_pag === id,
      );
      expect(deletedCondicao).toBeUndefined();
    }
  });

  test("with non-existent id", async () => {
    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/00000000-0000-4000-8000-000000000000`,
      {
        method: "DELETE",
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

  test("with invalid id format", async () => {
    const response = await fetch(
      `http://localhost:3000/api/condicao-pagamento/invalid-id`,
      {
        method: "DELETE",
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

  test("delete pix payment method", async () => {
    // Criar uma condição PIX específica
    const pixData = {
      description: "PIX Delete Test",
      installments: "1",
      discount: "5",
    };

    const createResponse = await fetch(
      "http://localhost:3000/api/condicao-pagamento",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pixData),
      },
    );

    const createResponseBody = await createResponse.json();
    const pixId = createResponseBody.id_cond_pag;

    // Deletar o PIX
    const deleteResponse = await fetch(
      `http://localhost:3000/api/condicao-pagamento/${pixId}`,
      {
        method: "DELETE",
      },
    );

    expect(deleteResponse.status).toBe(200);

    const deleteResponseBody = await deleteResponse.json();
    expect(deleteResponseBody.message).toBe(
      "Condição de pagamento deletada com sucesso.",
    );
  });
});
