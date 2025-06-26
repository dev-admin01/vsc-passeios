import { NextResponse } from "next/server";
import migrator from "../../../models/migrator";
import controller from "../../../errors/controller";
import { ServiceError } from "@/errors/errors";

export async function GET() {
  try {
    const migrations = await migrator.defaultMigrations();

    return NextResponse.json(
      {
        migrations,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function POST() {
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

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
