import { NextRequest, NextResponse } from "next/server";
import authentication from "@/models/authentication";
import controller from "@/errors/controller";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const authenticatedUser = await authentication.getAuthenticatedUser(
      userInputValues.email,
      userInputValues.password,
    );

    const token = await authentication.generateToken(authenticatedUser);

    const authenticatedUserWithToken = {
      ...authenticatedUser,
      token,
    };

    const cookieStore = await cookies();
    cookieStore.set("vsc-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json(authenticatedUserWithToken);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
