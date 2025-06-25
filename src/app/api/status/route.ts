import { NextRequest, NextResponse } from "next/server";
import { VerifyStatusService } from "../../../models/status";
import controller from "../../../errors/controller";

export async function GET(request: NextRequest) {
  try {
    const statusService = new VerifyStatusService();
    const status = await statusService.execute();
    return NextResponse.json({
      status,
    });
  } catch (error) {
    return controller.errorHandlers.onError(error, request);
  }
}

const unsupportedMethodHandler = (request: NextRequest) =>
  controller.errorHandlers.onNoMatch(request);

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
