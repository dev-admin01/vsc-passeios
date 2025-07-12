import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import dashboard from "@/models/dashboard";
export async function GET(request: NextRequest) {
  try {
    const id_user = request.headers.get("x-user-id");
    const id_position = request.headers.get("x-user-position");

    const dashboardData = await dashboard.getDashboard(
      id_user as string,
      Number(id_position),
    );

    return NextResponse.json(dashboardData);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}
