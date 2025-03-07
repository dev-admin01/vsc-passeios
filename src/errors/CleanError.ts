import { ErrorProps } from "./Error.type";

export class CleanError extends Error {
  public statusCode: number;
  public action: string;

  constructor({ cause }: ErrorProps) {
    super("Não foi possível desvincular o usuário de um pedido.", {
      cause,
    });

    this.name = "CleanError";
    this.action = "Contate o suporte.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
      cause: this.cause,
    };
  }
}
