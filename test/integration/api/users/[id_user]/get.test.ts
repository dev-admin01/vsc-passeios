import { version as uuidVersion } from "uuid";
import orchestrator from "../../../../orchestrator";

import { describe, test, expect } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/users/[id_user]", () => {
  test("with valid id", async () => {
    const userdata = {
      password: "senhateste",
    };

    const newUser = await orchestrator.createUser(userdata);

    const response = await fetch(
      `http://localhost:3000/api/users/${newUser.id_user}`,
    );

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id_user: responseBody.id_user,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      id_position: newUser.id_position,
      ddi: newUser.ddi,
      ddd: newUser.ddd,
      phone: newUser.phone,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(uuidVersion(responseBody.id_user)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });

  test("with invalid id", async () => {
    const response = await fetch(`http://localhost:3000/api/users/1234567890`);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O id não foi encontrado no sistema.",
      action: "Verifique se o id está correto.",
      status_code: 404,
    });
  });
});
