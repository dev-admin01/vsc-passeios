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
    console.error("ValidationError", error);
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  if (error instanceof NotFoundError) {
    console.error("NotFoundError", error);
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  if (error instanceof UnauthorizedError) {
    console.error("UnauthorizedError", error);
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
