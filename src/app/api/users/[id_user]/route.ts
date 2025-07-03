import controller from "@/errors/controller";
import user from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> },
) {
  try {
    const { id_user } = await params;
    const userFound = await user.findOneById(id_user);

    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> },
) {
  const { id_user } = await params;
  const userInputValues = await request.json();
  try {
    const userFound = await user.update(id_user, userInputValues);
    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> },
) {
  try {
    const { id_user } = await params;
    const deletedUser = await user.delete(id_user);

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
