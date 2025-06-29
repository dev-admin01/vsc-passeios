import { version as uuidVersion } from "uuid";
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
    description: "Midia para testes de cupons",
  });
  testMidiaId = testMidia.id_midia;
});

describe("POST /api/coupons", () => {
  describe("Create Coupons integration test", () => {
    test("with valid data", async () => {
      const couponData = {
        coupon: "TESTE10",
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

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id_coupons: responseBody.id_coupons,
        coupon: "TESTE10",
        discount: "10",
        id_midia: testMidiaId,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_coupons)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("with duplicate coupon code", async () => {
      const couponData1 = {
        coupon: "DUPLICATE",
        discount: "15",
        id_midia: testMidiaId,
      };

      await fetch("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponData1),
      });

      const couponData2 = {
        coupon: "DUPLICATE",
        discount: "20",
        id_midia: testMidiaId,
      };

      const response2 = await fetch("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponData2),
      });

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Cupom já cadastrado.",
        action: "Ajuste os dados informados e tente novamente.",
        status_code: 400,
      });
    });

    test("without coupon code", async () => {
      const couponData = {
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

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Cupom não informado.",
        action: "Informe um cupom para realizar esta operação.",
        status_code: 400,
      });
    });

    test("with empty coupon code", async () => {
      const couponData = {
        coupon: "",
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

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Cupom não informado.",
        action: "Informe um cupom para realizar esta operação.",
        status_code: 400,
      });
    });
  });
});
