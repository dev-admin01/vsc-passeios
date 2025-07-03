import controller from "@/errors/controller";
import user from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const users = await user.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const newUser = await user.createUser({
      ...userInputValues,
    });
    return NextResponse.json(newUser, { status: 201 });
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
