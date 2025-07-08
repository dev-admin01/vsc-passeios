import controller from "@/errors/controller";
import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const supplier_id = searchParams.get("supplier_id");
    const service_id = searchParams.get("service_id");

    const offset = (page - 1) * perpage;

    const whereClause: any = {};
    if (supplier_id) whereClause.id_supplier = supplier_id;
    if (service_id) whereClause.id_service = parseInt(service_id);

    const [services_suppliers, totalCount] = await Promise.all([
      prismaClient.serviceSupplier.findMany({
        where: whereClause,
        skip: offset,
        take: perpage,
        orderBy: { created_at: "desc" },
        include: {
          service: true,
          supplier: true,
        },
      }),
      prismaClient.serviceSupplier.count({ where: whereClause }),
    ]);

    const lastPage = Math.ceil(totalCount / perpage);

    return NextResponse.json(
      {
        services_suppliers,
        page,
        perpage,
        totalCount,
        lastPage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_supplier, id_service } = await request.json();

    if (!id_supplier || !id_service) {
      return NextResponse.json(
        { message: "ID do fornecedor e ID do serviço são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a associação já existe
    const existingAssociation = await prismaClient.serviceSupplier.findFirst({
      where: {
        id_supplier,
        id_service,
      },
    });

    if (existingAssociation) {
      return NextResponse.json(
        { message: "Esta associação já existe" },
        { status: 409 }
      );
    }

    const newServiceSupplier = await prismaClient.serviceSupplier.create({
      data: {
        id_supplier,
        id_service,
      },
      include: {
        service: true,
        supplier: true,
      },
    });

    return NextResponse.json(newServiceSupplier, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("Token")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
