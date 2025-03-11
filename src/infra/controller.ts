import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "@/infra/errors";
import { NextApiResponse } from "next";

function onNoMatchHandler(response: NextApiResponse) {
  const publicErrorObject = new MethodNotAllowedError({});
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error: any, response: NextApiResponse) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
