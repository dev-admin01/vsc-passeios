import controller from "@/errors/controller";
import user from "@/models/user";
import { NextRequest, NextResponse } from "next/server";


const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const newUser = await user.createUser({
      ...userInputValues,
    });
    return NextResponse.json(newUser);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const GET = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
