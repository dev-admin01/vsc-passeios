import { version as uuidVersion } from "uuid";
import orchestrator from "../../../orchestrator";

import { describe, test, expect } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Users Integration Test", () => {
  describe("POST /api/createuser", () => {
    test("should create a user", async () => {
      let user = {
        name: "teste123",
        email: "teste123@teste.com",
        password: "senha123",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const responseBody = await response.json();
      expect(responseBody.user).toEqual({
        id_user: responseBody.user.id_user,
        name: "teste123",
        email: "teste123@teste.com",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
        created_at: responseBody.user.created_at,
        updated_at: responseBody.user.updated_at,
      });

      expect(uuidVersion(responseBody.user.id_user)).toBe(4);
      expect(Date.parse(responseBody.user.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.user.updated_at)).not.toBeNaN();
    });
  });
});
