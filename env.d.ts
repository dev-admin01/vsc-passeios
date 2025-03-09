// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    // adicione outras variáveis conforme necessário
  }
}
