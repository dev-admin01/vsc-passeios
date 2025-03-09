import { version as uuidVersion } from "uuid";

import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/v1/me", () => {
  test("with valid data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: "user teste",
        email: "teste@teste.com",
        password: "senhateste",
        id_position: "1",
        ddi: "55",
        ddd: "11",
        phone: "999999999",
      }),
    });

    const responseBody = await response.json();

    const response1 = await fetch("http://localhost:3000/api/v1/auth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: "teste@teste.com",
        password: "senhateste",
      }),
    });

    expect(response1.status).toBe(200);

    const responseBody1 = await response1.json();
    expect(uuidVersion(responseBody.id_user)).toBe(4);

    expect(responseBody1).toMatchObject({
      id_user: responseBody.id_user,
      name: "user teste",
      email: "teste@teste.com",
      id_position: 1,
    });

    const response2 = await fetch("http://localhost:3000/api/v1/me", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${responseBody1.token}`,
      },
    });

    expect(response2.status).toBe(200);
  });
});
