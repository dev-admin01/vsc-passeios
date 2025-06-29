import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";
import midia from "@/models/midia";

let testMidiaId: number;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  // Criar uma mídia para usar nos testes
  const testMidia = await midia.create({
    description: "Midia para testes DELETE cupons",
  });
  testMidiaId = testMidia.id_midia;
});

describe("DELETE /api/coupons/[id_coupon]", () => {
  test("with valid id", async () => {
    // Criar um cupom para deletar
    const couponData = {
      coupon: "TOBEDELETED",
      discount: "10",
      id_midia: testMidiaId,
    };

    const createResponse = await fetch("http://localhost:3000/api/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });

    const createResponseBody = await createResponse.json();
    const couponId = createResponseBody.id_coupons;

    // Deletar o cupom
    const deleteResponse = await fetch(
      `http://localhost:3000/api/coupons/${couponId}`,
      {
        method: "DELETE",
      },
    );

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponseBody).toEqual({
      message: "Cupom deletado com sucesso.",
      status_code: 200,
    });

    // Verificar se o cupom foi realmente deletado tentando buscar
    const listResponse = await fetch("http://localhost:3000/api/coupons");
    const listResponseBody = await listResponse.json();

    const deletedCoupon = listResponseBody.coupons.find(
      (c: any) => c.id_coupons === couponId,
    );
    expect(deletedCoupon).toBeUndefined();
  });

  test("with non-existent id", async () => {
    const response = await fetch(
      `http://localhost:3000/api/coupons/00000000-0000-4000-8000-000000000000`,
      {
        method: "DELETE",
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "Cupom não encontrado.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });

  test("with invalid id format", async () => {
    const response = await fetch(
      `http://localhost:3000/api/coupons/invalid-id`,
      {
        method: "DELETE",
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "Cupom não encontrado.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });
});
