import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import { spawn } from "child_process";

async function defaultMigrations() {
  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");

  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Diretório de migrations não encontrado: ${migrationsDir}`);
  }

  try {
    const allMigrations = await readdir(migrationsDir);
    return allMigrations;
  } catch (error) {
    throw error;
  }
}

async function runMigrations() {
  return new Promise((resolve, reject) => {
    // 1) Primeiro spawn: "migrate deploy"
    const prismaMigrate = spawn("npx", ["prisma", "migrate", "deploy"], {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let migrateOutput = "";

    prismaMigrate.stdout.on("data", (data) => {
      migrateOutput += data.toString();
    });

    prismaMigrate.stderr.on("data", (data) => {
      migrateOutput += data.toString();
    });

    prismaMigrate.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `Migrações falharam com código ${code}\nLog: ${migrateOutput}`,
          ),
        );
      }

      // 2) Se chegou aqui, "migrate deploy" rodou com sucesso.
      // Agora vamos rodar o seed
      const prismaSeed = spawn("npx", ["prisma", "db", "seed"], {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let seedOutput = "";

      prismaSeed.stdout.on("data", (data) => {
        seedOutput += data.toString();
      });

      prismaSeed.stderr.on("data", (data) => {
        seedOutput += data.toString();
      });

      prismaSeed.on("close", (seedCode) => {
        if (seedCode !== 0) {
          return reject(
            new Error(`Seed falhou com código ${seedCode}\nLog: ${seedOutput}`),
          );
        }

        // 3) Se chegamos aqui, as seeds também rodaram
        // Agora podemos analisar o migrateOutput para extrair
        // quais migrações foram aplicadas, assim como no seu código anterior

        if (migrateOutput.includes("No pending migrations to apply.")) {
          // Sem migrações pendentes => array vazio
          return resolve([]);
        }

        // Extrair nomes das migrações aplicadas
        const startIndex = migrateOutput.indexOf("migrations/");
        const endIndex = migrateOutput.indexOf(
          "All migrations have been successfully applied.",
        );

        // Se não achar, usa o output inteiro
        const migrationsBlock =
          startIndex !== -1 && endIndex !== -1
            ? migrateOutput.substring(startIndex, endIndex)
            : migrateOutput;

        // Regex para capturar cada migração
        const regex = /(\d{14}_[^/]+)\/\s+└─ migration\.sql/g;
        const appliedMigrations: string[] = [];

        let match;
        while ((match = regex.exec(migrationsBlock)) !== null) {
          appliedMigrations.push(`${match[1]}/migration.sql`);
        }

        if (appliedMigrations.length === 0) {
          return resolve([]);
        }

        return resolve(appliedMigrations);
      });
    });
  });
}

const migrator = {
  defaultMigrations,
  runMigrations,
};

export default migrator;
