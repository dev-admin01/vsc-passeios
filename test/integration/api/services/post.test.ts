import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/services", () => {
  test("with valid data", async () => {
    const serviceData = {
      description: "Passeio de Teste",
      type: "1",
      price: "10000,99",
      time: ["08:00", "10:00", "14:00"],
      observation: "Observação de teste",
    };

    const response = await fetch("http://localhost:3000/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
      id_service: responseBody.id_service,
      description: serviceData.description,
      type: serviceData.type,
      price: "1000099",
      time: '["08:00","10:00","14:00"]',
      observation: "Observação de teste",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
    expect(typeof responseBody.id_service).toBe("number");
  });

  // test("with multiple time slots", async () => {
  //   const serviceData = {
  //     description: "Passeio Múltiplos Horários",
  //     type: "1",
  //     price: "15000",
  //     time: ["07:00", "08:30", "10:00", "11:30", "14:00", "15:30"],
  //     observation: "Passeio com vários horários disponíveis",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(201);
  //   expect(responseBody).toEqual({
  //     id_service: responseBody.id_service,
  //     description: serviceData.description,
  //     type: serviceData.type,
  //     price: "1500000",
  //     time: '["07:00","08:30","10:00","11:30","14:00","15:30"]',
  //     observation: "Passeio com vários horários disponíveis",
  //     created_at: expect.any(String),
  //     updated_at: expect.any(String),
  //   });
  // });

  // test("with single time slot", async () => {
  //   const serviceData = {
  //     description: "Passeio Único",
  //     type: "0",
  //     price: "5000",
  //     time: ["09:00"],
  //     observation: "Observação única",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(201);
  //   expect(responseBody).toEqual({
  //     id_service: responseBody.id_service,
  //     description: serviceData.description,
  //     type: serviceData.type,
  //     price: "500000",
  //     time: '["09:00"]',
  //     observation: "Observação única",
  //     created_at: expect.any(String),
  //     updated_at: expect.any(String),
  //   });
  // });

  // test("without description", async () => {
  //   const serviceData = {
  //     type: "1",
  //     price: "10000",
  //     time: ["08:00"],
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Descrição não informada.",
  //     action: "Informe uma descrição para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without type", async () => {
  //   const serviceData = {
  //     description: "Passeio de Teste",
  //     price: "10000",
  //     time: ["08:00"],
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Tipo não informado.",
  //     action: "Informe um tipo para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without price", async () => {
  //   const serviceData = {
  //     description: "Passeio de Teste",
  //     type: "1",
  //     time: ["08:00"],
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Preço não informado.",
  //     action: "Informe um preço para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without time", async () => {
  //   const serviceData = {
  //     description: "Passeio de Teste without time",
  //     type: "1",
  //     price: "10000",
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Horário não informado.",
  //     action: "Informe pelo menos um horário para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without observation", async () => {
  //   const serviceData = {
  //     description: "Passeio de Teste",
  //     type: "1",
  //     price: "10000",
  //     time: ["08:00"],
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Observação não informada.",
  //     action: "Informe uma observação para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("with empty description", async () => {
  //   const serviceData = {
  //     description: "",
  //     type: "1",
  //     price: "10000",
  //     time: ["08:00"],
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Descrição não informada.",
  //     action: "Informe uma descrição para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("with empty time array", async () => {
  //   const serviceData = {
  //     description: "Passeio de Teste empty time array",
  //     type: "1",
  //     price: "10000",
  //     time: [],
  //     observation: "Observação de teste",
  //   };

  //   const response = await fetch("http://localhost:3000/api/services", {
  //     method: "POST",
  //     body: JSON.stringify(serviceData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Horário não informado.",
  //     action: "Informe pelo menos um horário para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });
});
