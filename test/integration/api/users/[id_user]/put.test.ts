import { version as uuidVersion } from "uuid";
import orchestrator from "../../../../orchestrator";

import { describe, test, expect } from "@jest/globals";
import user from "@/models/user";
import password from "@/models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PUT /api/users/[id_user]", () => {
  describe("Update Users integration test", () => {
    test("with duplicate email", async () => {
      let userData = {
        email: "email1@teste.com",
      };

      await orchestrator.createUser(userData);

      let user2Data = {
        email: "email2@teste.com",
      };

      const user2 = await orchestrator.createUser(user2Data);

      const userUpdatedData = {
        name: user2.name,
        email: "email1@teste.com",
        id_position: user2.id_position,
        ddi: user2.ddi,
        ddd: user2.ddd,
        phone: user2.phone,
      };

      const response = await fetch(
        `http://localhost:3000/api/users/${user2.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userUpdatedData),
        }
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("with password change", async () => {
      let userData = {
        password: "senhaAntiga",
      };

      const userCreated = await orchestrator.createUser(userData);

      const userUpdatedData = {
        password: "senhaNova",
      };

      const response = await fetch(
        `http://localhost:3000/api/users/${userCreated.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userUpdatedData),
        }
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id_user: userCreated.id_user,
        name: userCreated.name,
        email: userCreated.email,
        password: responseBody.password,
        id_position: userCreated.id_position,
        ddi: userCreated.ddi,
        ddd: userCreated.ddd,
        phone: userCreated.phone,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(userCreated.id_user)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await user.findOneById(responseBody.id_user);

      const correctPasswordMatch = await password.compare(
        "senhaNova",
        userInDatabase?.password
      );
      const incorrectPasswordMatch = await password.compare(
        "senhaAntiga",
        userInDatabase.password
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("with valid data", async () => {
      let userData = {
        password: "senhaAntiga",
      };

      const userCreated = await orchestrator.createUser(userData);

      const userUpdatedData = {
        name: "Nome atualizado",
        email: "emailAtualizado@teste.com",
        id_position: userCreated.id_position,
        ddi: userCreated.ddi,
        ddd: userCreated.ddd,
        phone: userCreated.phone,
      };

      const response = await fetch(
        `http://localhost:3000/api/users/${userCreated.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userUpdatedData),
        }
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id_user: userCreated.id_user,
        name: "Nome atualizado",
        email: "emailatualizado@teste.com",
        password: userCreated.password,
        id_position: userCreated.id_position,
        ddi: userCreated.ddi,
        ddd: userCreated.ddd,
        phone: userCreated.phone,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(userCreated.id_user)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
