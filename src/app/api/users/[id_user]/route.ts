import controller from "@/errors/controller";
import user from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  const { id_user } = await params;
  try {
    const userFound = await user.findOneById(id_user);
    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
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
  { params }: { params: Promise<{ id_user: string }> }
) {
  const { id_user } = await params;
  try {
    const userFound = await user.delete(id_user);
    return NextResponse.json(userFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
