import retry from "async-retry";
import prismaClient from "../src/prisma/index";

// import { RunMigrationsService } from "../src/services/migrations/run_migrations_services";

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

// async function runPendingMigrations() {
//   const migrationsService = new RunMigrationsService();
//   await migrationsService.execute();
// }

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  // runPendingMigrations,
};

export default orchestrator;
