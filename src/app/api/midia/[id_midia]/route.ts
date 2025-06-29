import { NextRequest, NextResponse } from "next/server";
import midia from "../../../../models/midia";
import controller from "../../../../errors/controller";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_midia: string }> }
) => {
  try {
    const { id_midia } = await params;
    console.log("id_midia controller", id_midia);
    const deletedMidia = await midia.deleteById(Number(id_midia));
    return NextResponse.json(deletedMidia);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_midia: string }> }
) => {
  try {
    const { id_midia } = await params;
    const midiaInputValues = await request.json();

    const updatedMidia = await midia.updateById(
      Number(id_midia),
      midiaInputValues
    );
    return NextResponse.json(updatedMidia);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};
