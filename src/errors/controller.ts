import { NextResponse } from "next/server";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";

function onNoMatchHandler() {
  const publicErrorObject = new MethodNotAllowedError();
  console.log("no onNoMatchHandler", publicErrorObject);
  return NextResponse.json(publicErrorObject, {
    status: publicErrorObject.statusCode,
  });
}

function onErrorHandler(error: Error) {
  if (error instanceof ValidationError) {
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObject);
  return NextResponse.json(publicErrorObject, {
    status: publicErrorObject.statusCode,
  });
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
