import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import midia from "@/models/midia";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const midias = await midia.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(midias, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const createdMidia = await midia.create(body);

    return NextResponse.json(createdMidia, { status: 201 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
