import orchestrator from "../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/condicao-pagamento", () => {
  test("with pagination", async () => {
    // Criar múltiplas condições para testar paginação
    const paymentMethods = [
      { description: "PIX", installments: "1", discount: "5" },
      { description: "Dinheiro", installments: "1", discount: "3" },
      { description: "Cartão de Débito", installments: "1", discount: "0" },
      { description: "Cartão de Crédito 3x", installments: "3", discount: "0" },
      { description: "Cartão de Crédito 6x", installments: "6", discount: "0" },
    ];

    for (const method of paymentMethods) {
      await fetch("http://localhost:3000/api/condicao-pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(method),
      });
    }

    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.condicoesPagamento)).toBe(true);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(10);
    expect(responseBody.totalCount).toBe(5);
    expect(responseBody.lastPage).toBe(1);

    // Verificar se a primeira condição contém os dados esperados
    expect(responseBody.condicoesPagamento[0]).toEqual({
      id_cond_pag: responseBody.condicoesPagamento[0].id_cond_pag,
      description: responseBody.condicoesPagamento[0].description,
      installments: responseBody.condicoesPagamento[0].installments,
      discount: responseBody.condicoesPagamento[0].discount,
      created_at: responseBody.condicoesPagamento[0].created_at,
      updated_at: responseBody.condicoesPagamento[0].updated_at,
    });
  });

  test("with pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento?page=1&perpage=3",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(3);
    expect(responseBody.condicoesPagamento.length).toBeLessThanOrEqual(3);
  });

  test("with search parameter", async () => {
    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento?search=PIX",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.condicoesPagamento)).toBe(true);

    // Verificar se todas as condições retornadas contêm o termo pesquisado
    responseBody.condicoesPagamento.forEach((condicao: any) => {
      expect(condicao.description.toLowerCase()).toContain("pix");
    });
  });

  test("with search for credit card", async () => {
    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento?search=Cartão",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.condicoesPagamento)).toBe(true);

    // Verificar se retorna apenas condições de cartão
    responseBody.condicoesPagamento.forEach((condicao: any) => {
      expect(condicao.description.toLowerCase()).toContain("cartão");
    });
  });

  test("with empty result", async () => {
    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento?search=INEXISTENTE",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.condicoesPagamento).toEqual([]);
    expect(responseBody.totalCount).toBe(0);
    expect(responseBody.lastPage).toBe(0);
  });

  test("with case insensitive search", async () => {
    const response = await fetch(
      "http://localhost:3000/api/condicao-pagamento?search=pix",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.condicoesPagamento.length).toBeGreaterThan(0);

    responseBody.condicoesPagamento.forEach((condicao: any) => {
      expect(condicao.description.toLowerCase()).toContain("pix");
    });
  });
});
