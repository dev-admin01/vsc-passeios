import controller from "@/errors/controller";
import user from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

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
