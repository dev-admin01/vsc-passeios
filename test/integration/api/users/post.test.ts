import { version as uuidVersion } from "uuid";
import orchestrator from "../../../orchestrator";

import { describe, test, expect } from "@jest/globals";
import user from "@/models/user";
import password from "@/models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/users", () => {
  describe("Create Users integration test", () => {
    test("with unique and valid data", async () => {
      let userData = {
        name: "emailvalido",
        email: "emailvalido@teste.com",
        password: "senha123",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id_user: responseBody.id_user,
        name: "emailvalido",
        email: "emailvalido@teste.com",
        password: responseBody.password,
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_user)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneById(responseBody.id_user);

      const correctPasswordMatch = await password.compare(
        userData.password,
        userInDatabase?.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhateste2",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("with duplicate email", async () => {
      let user1 = {
        name: "user1",
        email: "user1@teste.com",
        password: "senha123",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user1),
      });

      let user2 = {
        name: "user2",
        email: "user1@teste.com",
        password: "senha123",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response2 = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user2),
      });

      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("without password", async () => {
      let user = {
        name: "sem senha",
        email: "semsenha@teste.com",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Senha não informada.",
        action: "Informe uma senha para realizar esta operação.",
        status_code: 400,
      });
    });

    test("with case insensitive email", async () => {
      let userData = {
        name: "emailvalidouppercase",
        email: "EMAILVALIDOUPPERCASE@teste.com",
        password: "senha123",
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
      };

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id_user: responseBody.id_user,
        name: "emailvalidouppercase",
        email: "emailvalidouppercase@teste.com",
        password: responseBody.password,
        id_position: 1,
        ddi: "55",
        ddd: "11",
        phone: "999995555",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id_user)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneById(responseBody.id_user);

      const correctPasswordMatch = await password.compare(
        userData.password,
        userInDatabase?.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhateste2",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
