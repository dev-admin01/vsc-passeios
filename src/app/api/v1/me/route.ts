import { NextRequest, NextResponse } from "next/server";
import me from "@/models/me";
import { InvalidTokenError } from "@/infra/errors";

export async function GET(req: NextRequest) {
  try {
    const user_id = req.headers.get("user-id");
    const data = user_id ? user_id : "";
    const newUser = await me.DetailUser(data);
    return NextResponse.json(newUser, { status: 200 });
  } catch (error: any) {
    if (error instanceof InvalidTokenError) {
      return NextResponse.json(error.toJSON(), { status: error.statusCode });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
