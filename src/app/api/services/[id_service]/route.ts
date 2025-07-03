import controller from "@/errors/controller";
import service from "@/models/service";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_service: number }> },
) {
  try {
    const serviceInputValues = await request.json();
    const { id_service } = await params;

    const updatedService = await service.updateById(
      Number(id_service),
      serviceInputValues,
    );
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id_service: number }> },
) {
  try {
    const { id_service } = await params;

    const deletedService = await service.deleteById(Number(id_service));
    return NextResponse.json(deletedService, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_service: number }> },
) {
  try {
    const { id_service } = await params;

    const serviceFound = await service.findOneById(Number(id_service));
    return NextResponse.json(serviceFound, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
