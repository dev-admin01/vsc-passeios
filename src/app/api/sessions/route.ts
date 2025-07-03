import { NextRequest, NextResponse } from "next/server";
import authentication from "@/models/authentication";
import { cookies } from "next/headers";
import controller from "@/errors/controller";

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const authenticatedUser = await authentication.getAuthenticatedUser(
      userInputValues.email,
      userInputValues.password
    );

    const token = await authentication.generateToken(authenticatedUser);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ token, authenticatedUser });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
