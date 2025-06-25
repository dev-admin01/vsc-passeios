export interface ErrorOptions {
  cause?: unknown;
  message?: string;
  action?: string;
  statusCode?: number;
}

export class InternalServerError extends Error {
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(options.message || "Um erro interno não esperado aconteceu.", {
      cause: options.cause,
    });

    this.name = "InternalServerError";
    this.action = options.action || "Entre em contato com o suporte.";
    this.statusCode = options.statusCode || 500;
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
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(options.message || "Serviço indisponível no momento.", {
      cause: options.cause,
    });

    this.name = "ServiceError";
    this.action = options.action || "Verifique se o serviço está disponível.";
    this.statusCode = 503;
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
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(options.message || "Método não permitido para esse endpoint.");

    this.name = "MethodNotAllowedError";
    this.action =
      options.action ||
      "Verifique se o método HTTP enviado é válido para este endpoint.";
    this.statusCode = 405;
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

export class ValidationError extends Error {
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(options.message || "Um erro de validação ocorreu.", {
      cause: options.cause,
    });

    this.name = "ValidationError";
    this.action =
      options.action || "Ajuste os dados informados e tente novamente.";
    this.statusCode = 400;
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

export class NotFoundError extends Error {
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(
      options.message || "Não foi possível encontrar o recurso no sistema.",
      {
        cause: options.cause,
      }
    );

    this.name = "NotFoundError";
    this.action =
      options.action ||
      "Verifique se os parâmetros enviados na consulta estão corretos.";
    this.statusCode = 404;
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

export class UnauthorizedError extends Error {
  action: string;
  statusCode: number;

  constructor(options: ErrorOptions = {}) {
    super(options.message || "Usuário não autenticado.", {
      cause: options.cause,
    });

    this.name = "UnauthorizedError";
    this.action = options.action || "Faça novamente o login para continuar.";
    this.statusCode = 401;
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
