import { NextRequest, NextResponse } from "next/server";

import auth from "@/models/auth";
import { ValidationError } from "@/infra/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorization = await auth.singIn(body);
    return NextResponse.json(authorization, { status: 200 });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json(error.toJSON(), { status: error.statusCode });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
