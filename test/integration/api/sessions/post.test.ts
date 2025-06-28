import orchestrator from "@/../test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/sessions", () => {
  test("with correct email and password", async () => {
    const userData = {
      email: "teste@teste.com",
      password: "senhateste",
    };

    const newUser = await orchestrator.createUser(userData);

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(200);

    expect(responseBody.authenticatedUser).toEqual({
      id_user: newUser.id_user,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      id_position: newUser.id_position,
      ddi: newUser.ddi,
      ddd: newUser.ddd,
      phone: newUser.phone,
      created_at: responseBody.authenticatedUser.created_at,
      updated_at: responseBody.authenticatedUser.updated_at,
    });
  });

  test("with incorrect email but correct password", async () => {
    const userData = {
      email: "emailcorreto@teste.com",
      password: "senhateste",
    };

    const newUser = await orchestrator.createUser(userData);

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        email: "emailerrado@teste.com",
        password: newUser.password,
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(401);

    expect(responseBody.name).toBe("UnauthorizedError");
    expect(responseBody.message).toBe("Dados de autenticação não conferem.");
    expect(responseBody.action).toBe(
      "Verifique se o email e a senha estão corretos.",
    );
    expect(responseBody.status_code).toBe(401);
  });
});
