import { version as uuidVersion } from "uuid";
import orchestrator from "../../../../orchestrator";

import { describe, test, expect } from "@jest/globals";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/users/[id_user]", () => {
  test("with invalid id", async () => {
    const userdata = {};

    await orchestrator.createUser(userdata);

    const response = await fetch("http://localhost:3000/api/users/1234567890", {
      method: "DELETE",
    });

    expect(response.status).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O id não foi encontrado no sistema.",
      action: "Verifique se o id está correto.",
      status_code: 404,
    });
  });

  test("with valid id", async () => {
    const userdata = {};

    const newUser = await orchestrator.createUser(userdata);

    const response = await fetch(
      `http://localhost:3000/api/users/${newUser.id_user}`,
      {
        method: "DELETE",
      }
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id_user: newUser.id_user,
      message: "Usuário deletado com sucesso.",
    });
  });
});
