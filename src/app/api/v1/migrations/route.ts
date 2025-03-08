import { NextResponse } from "next/server";
// import controller from "@/infra/controller";
import migrator from "@/models/migrator";

export async function GET() {
  const pendingMigrations = await migrator.listPendingMigrations();
  return NextResponse.json(pendingMigrations, { status: 200 });
}

export async function POST() {
  const migratedMigrations = await migrator.runPendingMigrations();

  console.log(migratedMigrations);
  if (migratedMigrations.length > 0) {
    return NextResponse.json(migratedMigrations, { status: 201 });
  }

  return NextResponse.json(migratedMigrations, { status: 200 });
}
