import { NextResponse } from "next/server";
import { VerifyStatusService } from "../../../models/status";
import controller from "../../../errors/controller";

export async function GET() {
  try {
    const statusService = new VerifyStatusService();
    const status = await statusService.execute();
    return NextResponse.json({
      status,
    });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
