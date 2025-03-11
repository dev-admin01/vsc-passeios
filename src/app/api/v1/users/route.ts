import { NextRequest, NextResponse } from "next/server";
import user from "@/models/user";
import { ValidationError } from "@/infra/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newUser = await user.create(body);

    return NextResponse.json(newUser, { status: 201 });
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
