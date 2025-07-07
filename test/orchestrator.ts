import retry from "async-retry";
import prismaClient from "../src/prisma/index";
import migrator from "../src/models/migrator";
import user from "@/models/user";
import customer from "@/models/customer";

import { faker } from "@faker-js/faker";
import midia from "@/models/midia";
import coupon from "@/models/coupon";
import service from "@/models/service";

async function waitForAllServices() {
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/status");
      if (response.status != 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  try {
    await prismaClient.$executeRawUnsafe(`DROP SCHEMA public CASCADE;`);
    await prismaClient.$executeRawUnsafe(`CREATE SCHEMA public;`);
  } catch (e) {
    console.error("Erro ao limpar DB:", e);
    throw e;
  }
}

async function runPendingMigrations() {
  const migrations = await migrator.runMigrations();
  return migrations;
}

async function createUser(userData: any) {
  return await user.createUser({
    name: userData.name || faker.person.fullName(),
    email: userData.email || faker.internet.email(),
    password: userData.password || "senha123",
    id_position: userData.id_position || 2,
    ddi: userData.ddi || "55",
    ddd: userData.ddd || "11",
    phone: userData.phone || "999995555",
  });
}

async function createCustomer(customerData: any) {
  const uniqueEmail =
    customerData.email || `customer-${Date.now()}-${Math.random()}@example.com`;

  return await customer.create({
    nome: customerData.nome || faker.person.fullName(),
    email: uniqueEmail,
    cpf_cnpj: customerData.cpf_cnpj || faker.string.numeric(11),
    rg: customerData.rg || faker.string.numeric(9),
    ddi: customerData.ddi || "55",
    ddd: customerData.ddd || "11",
    telefone: customerData.telefone || faker.phone.number(),
    indicacao: customerData.indicacao || null,
    ...customerData,
  });
}

async function createMidia(midiaData: any) {
  return await midia.create({
    description: midiaData.description || faker.lorem.sentence(),
  });
}

async function createCoupon(couponData: any) {
  return await coupon.create({
    coupon:
      couponData.coupon ||
      faker.word.adjective({ length: { min: 1, max: 15 } }),
    discount: couponData.discount || "10",
    id_midia: couponData.id_midia || null,
  });
}

async function createService(serviceData: any) {
  return await service.create({
    description: serviceData.description || faker.lorem.sentence(),
    type: serviceData.type || "0",
    price: serviceData.price || "10000",
    observation: serviceData.observation || faker.lorem.sentence(),
    time: serviceData.time || '["12:00","12:30","13:00","13:30","14:00"]',
  });
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createCustomer,
  createMidia,
  createService,
  createCoupon,
};

export default orchestrator;
