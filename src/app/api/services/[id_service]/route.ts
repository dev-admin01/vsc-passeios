import controller from "@/errors/controller";
import service from "@/models/service";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_service: string }> },
) {
  try {
    const { id_service } = await params;
    const serviceInputValues = await request.json();

    const updatedService = await service.updateById(
      Number(id_service),
      serviceInputValues,
    );

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_service: string }> },
) {
  try {
    const { id_service } = await params;
    const deletedService = await service.deleteById(Number(id_service));

    return NextResponse.json(deletedService, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function GET(
  request: NextRequest,

  { params }: { params: Promise<{ id_service: string }> },
) {
  try {
    const { id_service } = await params;
    const serviceFound = await service.findOneById(Number(id_service));

    return NextResponse.json(serviceFound, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
