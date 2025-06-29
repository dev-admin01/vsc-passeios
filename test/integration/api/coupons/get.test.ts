import orchestrator from "../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";
import midia from "@/models/midia";

let testMidiaId: number;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  // Criar uma mídia para usar nos testes de cupons
  const testMidia = await midia.create({
    description: "Midia para testes GET cupons",
  });
  testMidiaId = testMidia.id_midia;
});

describe("GET /api/coupons", () => {
  test("with pagination", async () => {
    // Criar múltiplos cupons para testar paginação
    for (let i = 0; i < 5; i++) {
      const couponData = {
        coupon: `TESTE${i + 1}`,
        discount: `${(i + 1) * 5}`,
        id_midia: testMidiaId,
      };

      await fetch("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponData),
      });
    }

    const response = await fetch("http://localhost:3000/api/coupons");
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.coupons)).toBe(true);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(10);
    expect(responseBody.totalCount).toBe(5);
    expect(responseBody.lastPage).toBe(1);

    // Verificar se o primeiro cupom contém os dados esperados
    expect(responseBody.coupons[0]).toEqual({
      id_coupons: responseBody.coupons[0].id_coupons,
      coupon: responseBody.coupons[0].coupon,
      discount: responseBody.coupons[0].discount,
      id_midia: testMidiaId,
      created_at: responseBody.coupons[0].created_at,
      updated_at: responseBody.coupons[0].updated_at,
      midia: {
        id_midia: testMidiaId,
        description: "Midia para testes GET cupons",
      },
    });
  });

  test("with pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/coupons?page=1&perpage=3",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.page).toBe(1);
    expect(responseBody.perpage).toBe(3);
    expect(responseBody.coupons.length).toBeLessThanOrEqual(3);
  });

  test("with search parameter", async () => {
    const response = await fetch(
      "http://localhost:3000/api/coupons?search=TESTE1",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody.coupons)).toBe(true);

    // Verificar se todos os cupons retornados contêm o termo pesquisado
    responseBody.coupons.forEach((coupon: any) => {
      expect(coupon.coupon.toLowerCase()).toContain("teste1");
    });
  });

  test("with empty result", async () => {
    const response = await fetch(
      "http://localhost:3000/api/coupons?search=INEXISTENTE",
    );
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.coupons).toEqual([]);
    expect(responseBody.totalCount).toBe(0);
    expect(responseBody.lastPage).toBe(0);
  });
});
