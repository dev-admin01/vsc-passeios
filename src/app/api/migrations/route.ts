import { NextRequest, NextResponse } from "next/server";
import migrator from "../../../models/migrator";
import controller from "../../../errors/controller";
import { ServiceError } from "@/errors/errors";

export async function GET(request: NextRequest) {
  try {
    const migrations = await migrator.defaultMigrations();

    return NextResponse.json(
      {
        migrations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const migrations = await migrator.runMigrations();
    return NextResponse.json(migrations, { status: 201 });
  } catch (error) {
    const publicErrorObject = new ServiceError({
      message: "Erro na conexão com Banco ou na Query.",
      cause: error,
    });
    console.error(publicErrorObject);
    return controller.errorHandlers.onError(publicErrorObject);
  }
}
