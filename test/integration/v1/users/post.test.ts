describe("POST to /api/v1/status", () => {
  test("Create user with valids inputs", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(201);

    // const responseBody = await response.json();
  });
});
