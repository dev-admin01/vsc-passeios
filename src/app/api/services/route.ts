import controller from "@/errors/controller";
import service from "@/models/service";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const services = await service.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceInputValues = await request.json();
    const newService = await service.create(serviceInputValues);

    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
