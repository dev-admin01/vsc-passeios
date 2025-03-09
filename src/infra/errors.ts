export interface CustomErrorProps {
  cause?: unknown;
  action?: unknown | string;
  statusCode?: number;
  message?: string;
}

export class InternalServerError extends Error {
  public statusCode: number;
  public action: string;
  public cause?: unknown;

  constructor({ cause, statusCode }: CustomErrorProps) {
    super("Um erro interno não esperado aconteceu.");

    this.cause = cause;
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  public statusCode: number;
  public action: string;
  public cause?: unknown;

  constructor({ cause, message }: CustomErrorProps) {
    super(message || "Serviço indisponível no momento.");

    this.cause = cause;
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;

    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public statusCode: number;
  public action: string;
  public cause?: unknown;

  constructor({ cause, message }: CustomErrorProps = {}) {
    super(message || "Método não permitido para esse endpoint.");

    this.name = "MethodNotAllowedError";
    this.cause = cause;
    this.action =
      "Verifique se o método HTTP enviado é valido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  public statusCode: number;
  public action?: string;
  public cause?: unknown;

  constructor({ cause, message, action }: CustomErrorProps) {
    super(message || "Um erro de validação ocorreu.");

    this.cause = cause;
    this.name = "ValidationError";
    this.action =
      typeof action === "string" ? action : "Ajuste os dados enviados.";
    this.statusCode = 400;

    // Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
