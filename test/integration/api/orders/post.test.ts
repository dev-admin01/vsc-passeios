import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/orders", () => {
  test("with valid data, whitout customer, coupon and cond_pag", async () => {
    const service = await orchestrator.createService({
      price: "799,99",
    });
    const user = await orchestrator.createUser({});

    const orderData = {
      id_user: user.id_user,
      pre_name: "Cliente de Teste",
      pre_email: "cliente@teste.com",
      pre_cpf_cnpj: "12345678901",
      pre_ddi: "55",
      pre_ddd: "11",
      pre_phone: "999887766",
      price: "10000",
      id_customer: null,
      id_coupons: null,
      id_cond_pag: null,
      services: [
        {
          id_service: service.id_service,
          price: "79999",
          quantity: 1,
          discount: 0,
          suggested_date: new Date().toISOString(),
          time: service.time,
        },
      ],
    };

    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const responseBody = await response.json();
    console.log("responseBody", responseBody);

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
      id_order: responseBody.id_order,
      order_number: responseBody.order_number,
      price: "1000000",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        id_position: user.id_position,
        ddi: user.ddi,
        ddd: user.ddd,
        phone: user.phone,
      },
      orders_service: [
        {
          id_order_service: responseBody.orders_service[0].id_order_service,
          id_service: service.id_service,
          id_order: responseBody.id_order,
          price: service.price,
          quantity: 1,
          discount: "0",
          suggested_date: responseBody.orders_service[0].suggested_date,
          time: '["12:00","12:30","13:00","13:30","14:00"]',
          created_at: responseBody.orders_service[0].created_at,
          updated_at: responseBody.orders_service[0].updated_at,
        },
      ],
    });

    expect(Array.isArray(responseBody.orders_service)).toBe(true);
    expect(responseBody.orders_service.length).toBe(1);
    expect(typeof responseBody.id_order).toBe("string");
  });

  // test("with multiple services", async () => {
  //   const orderData = {
  //     id_user: "1",
  //     pre_name: "Cliente Múltiplos Serviços",
  //     pre_email: "cliente.multiplos@teste.com",
  //     pre_phone: "11999888777",
  //     services: [
  //       {
  //         id_service: 1,
  //         price: "15000",
  //         quantity: 2,
  //         discount: 10,
  //       },
  //       {
  //         id_service: 2,
  //         price: "20000",
  //         quantity: 1,
  //         discount: 5,
  //       },
  //     ],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(201);
  //   expect(responseBody.orders_service.length).toBe(2);
  //   expect(responseBody.orders_service[0].quantity).toBe(2);
  //   expect(responseBody.orders_service[0].discount).toBe(10);
  //   expect(responseBody.orders_service[1].quantity).toBe(1);
  //   expect(responseBody.orders_service[1].discount).toBe(5);
  // });

  // test("with only email contact", async () => {
  //   const orderData = {
  //     id_user: "1",
  //     pre_email: "somente.email@teste.com",
  //     services: [
  //       {
  //         id_service: 1,
  //         price: "5000",
  //         quantity: 1,
  //         discount: 0,
  //       },
  //     ],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Dados de contato invalidos, preencha todos os campos.",
  //     action:
  //       "É necessário informar todos os campos de contato para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("with only phone contact", async () => {
  //   const orderData = {
  //     id_user: "1",
  //     pre_name: "Cliente Só Telefone",
  //     pre_phone: "11888777666",

  //     services: [
  //       {
  //         id_service: 1,
  //         price: "8000",
  //         quantity: 1,
  //         discount: 0,
  //       },
  //     ],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Dados de contato invalidos, preencha todos os campos.",
  //     action:
  //       "É necessário informar todos os campos de contato para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without id_user", async () => {
  //   const orderData = {
  //     pre_name: "Cliente Sem Usuário",
  //     pre_email: "sem.usuario@teste.com",
  //     services: [
  //       {
  //         id_service: 1,
  //         price: "10000",
  //         quantity: 1,
  //         discount: 0,
  //       },
  //     ],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Dados de contato invalidos, preencha todos os campos.",
  //     action:
  //       "É necessário informar todos os campos de contato para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without services", async () => {
  //   const orderData = {
  //     pre_cpf_cnpj: "12345678901",
  //     pre_name: "Cliente Sem Serviços",
  //     pre_email: "sem.servicos@teste.com",
  //     pre_ddi: "55",
  //     pre_ddd: "11",
  //     pre_phone: "11999888777",
  //     price: "10000",
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Serviços não informados.",
  //     action: "Informe pelo menos um serviço para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("with empty services array", async () => {
  //   const orderData = {
  //     pre_cpf_cnpj: "12345678901",
  //     pre_name: "Cliente Sem Serviços",
  //     pre_email: "sem.servicos@teste.com",
  //     pre_ddi: "55",
  //     pre_ddd: "11",
  //     id_user: "",
  //     pre_phone: "11999888777",
  //     price: "10000",
  //     services: [],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Serviços não informados.",
  //     action: "Informe pelo menos um serviço para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });

  // test("without contact information", async () => {
  //   const orderData = {
  //     services: [
  //       {
  //         id_service: 1,
  //         price: "10000",
  //         quantity: 1,
  //         discount: 0,
  //       },
  //     ],
  //   };

  //   const response = await fetch("http://localhost:3000/api/orders", {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   });

  //   const responseBody = await response.json();

  //   expect(response.status).toBe(400);
  //   expect(responseBody).toEqual({
  //     name: "ValidationError",
  //     message: "Dados de contato invalidos, preencha todos os campos.",
  //     action:
  //       "É necessário informar todos os campos de contato para realizar esta operação.",
  //     status_code: 400,
  //   });
  // });
});
