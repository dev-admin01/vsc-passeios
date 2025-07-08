import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import { getCookieServer } from "@/lib/cookieServer";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("vsc-session")?.value;
    console.log("token na api", token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Dashboard" });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
