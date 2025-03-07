import { ErrorProps } from "./Error.type";

export class AuthError extends Error {
  public statusCode: number;
  public action: string;

  constructor({ cause }: ErrorProps) {
    super("Houve um erro durante a autenticação.", {
      cause,
    });

    this.name = "AuthError";
    this.action = "Usuário ou senha inválidos, tente logar novamente.";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
      cause: this.cause ? String(this.cause) : undefined,
    };
  }
}
