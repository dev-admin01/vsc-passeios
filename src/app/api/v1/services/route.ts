import { NextRequest, NextResponse } from "next/server";
import services from "@/models/services";
// import { ValidationError } from "@/infra/errors";

export async function POST(request: NextRequest) {
  try {
    const service = await request.json();
    const newService = await services.create(service);
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.log(error);
    // if (error instanceof ValidationError) {
    //   return NextResponse.json(error.toJSON(), { status: error.statusCode });
    // }
    // return NextResponse.json(
    //   { message: "Internal Server Error" },
    //   { status: 500 }
    // );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("chegou no controller");
    // Extrair os parâmetros da query string
    const { searchParams } = new URL(request.url);
    console.log("params:", searchParams);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const search = searchParams.get("search") ?? "";

    const serviceList = await services.list({ page, limit, search });
    console.log("controller service:", serviceList);
    return NextResponse.json(serviceList, { status: 200 });
  } catch (error: any) {
    console.log(error);
  }
}
