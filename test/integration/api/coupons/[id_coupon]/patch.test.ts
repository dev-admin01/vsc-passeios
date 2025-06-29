import orchestrator from "../../../../orchestrator";
import { describe, test, expect, beforeAll } from "@jest/globals";
import midia from "@/models/midia";

let testMidiaId: number;
let testCouponId: string;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  // Criar uma mídia para usar nos testes
  const testMidia = await midia.create({
    description: "Midia para testes PATCH cupons",
  });
  testMidiaId = testMidia.id_midia;

  // Criar um cupom para usar nos testes de atualização
  const couponData = {
    coupon: "ORIGINAL",
    discount: "10",
    id_midia: testMidiaId,
  };

  const response = await fetch("http://localhost:3000/api/coupons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(couponData),
  });

  const responseBody = await response.json();
  testCouponId = responseBody.id_coupons;
});

describe("PATCH /api/coupons/[id_coupon]", () => {
  test("with valid data", async () => {
    const updateData = {
      coupon: "UPDATED",
      discount: "15",
      id_midia: testMidiaId,
    };

    const response = await fetch(
      `http://localhost:3000/api/coupons/${testCouponId}`,
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
      id_coupons: testCouponId,
      coupon: "UPDATED",
      discount: "15",
      id_midia: testMidiaId,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test("with duplicate coupon code", async () => {
    // Criar outro cupom primeiro
    const anotherCouponData = {
      coupon: "ANOTHER",
      discount: "20",
      id_midia: testMidiaId,
    };

    await fetch("http://localhost:3000/api/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(anotherCouponData),
    });

    // Tentar atualizar o cupom existente com código duplicado
    const updateData = {
      coupon: "ANOTHER",
      discount: "25",
      id_midia: testMidiaId,
    };

    const response = await fetch(
      `http://localhost:3000/api/coupons/${testCouponId}`,
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
      message: "Cupom já cadastrado.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 400,
    });
  });

  test("with non-existent id", async () => {
    const updateData = {
      coupon: "NONEXISTENT",
      discount: "30",
      id_midia: testMidiaId,
    };

    const response = await fetch(
      `http://localhost:3000/api/coupons/00000000-0000-4000-8000-000000000000`,
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
      message: "Cupom não encontrado.",
      action: "Ajuste os dados informados e tente novamente.",
      status_code: 404,
    });
  });

  test("without coupon code", async () => {
    const updateData = {
      discount: "35",
      id_midia: testMidiaId,
    };

    const response = await fetch(
      `http://localhost:3000/api/coupons/${testCouponId}`,
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
      message: "Cupom não informado.",
      action: "Informe um cupom para realizar esta operação.",
      status_code: 400,
    });
  });
});
