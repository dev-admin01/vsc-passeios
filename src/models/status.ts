import prismaClient from "../prisma";

class VerifyStatusService {
  async execute() {
    const updatedAt = new Date().toISOString();

    // Versão do banco
    const [databaseVersionResult] = await prismaClient.$queryRawUnsafe<
      { server_version: string }[]
    >("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.server_version;

    // Máximo de conexões
    const [databaseMaxConnectionsResult] = await prismaClient.$queryRawUnsafe<
      { max_connections: string }[]
    >("SHOW max_connections;");
    const databaseMaxConnectionsValue = parseInt(
      databaseMaxConnectionsResult.max_connections
    );
    // Conexões ativas
    const databaseName = process.env.POSTGRES_DB;

    // Usando .concat para evitar interpolar valores diretamente na query:
    const queryConnections = `
      SELECT count(*)::int AS count
      FROM pg_stat_activity
      WHERE datname = $1;
    `;
    const [databaseOpenedConnectionResult] = await prismaClient.$queryRawUnsafe<
      { count: number }[]
    >(queryConnections, databaseName);

    const databaseOpenedConnectionValue = databaseOpenedConnectionResult.count;

    await prismaClient.$disconnect();

    // Monta o objeto de retorno
    return {
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: databaseMaxConnectionsValue,
          opened_connections: databaseOpenedConnectionValue,
        },
      },
    };
  }
}

export { VerifyStatusService };
