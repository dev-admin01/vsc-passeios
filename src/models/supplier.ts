import prismaClient from "@/prisma";
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  Jurisdicao,
} from "@/types/supplier.types";
import { ValidationError, NotFoundError } from "@/errors/errors";

async function create(supplierInputValues: CreateSupplierRequest) {
  await validateRequiredFields(supplierInputValues);

  if (supplierInputValues.email) {
    supplierInputValues.email = supplierInputValues.email.toLowerCase();
    await validateUniqueEmail(supplierInputValues.email);
  }

  if (supplierInputValues.jurisdicao === Jurisdicao.BRASIL) {
    if (supplierInputValues.cnpj) {
      supplierInputValues.cnpj = supplierInputValues.cnpj.replace(/\D/g, "");
      await validateUniqueCnpj(supplierInputValues.cnpj);
    }
  }

  if (supplierInputValues.jurisdicao === Jurisdicao.SAN_ANDRES) {
    if (supplierInputValues.tax_id) {
      await validateUniqueTaxId(supplierInputValues.tax_id);
    }
    if (supplierInputValues.registro_san) {
      await validateUniqueRegistroSan(supplierInputValues.registro_san);
    }
  }

  const { service_ids, ...supplierData } = supplierInputValues;

  const newSupplier = await runInsertQuery(supplierData, service_ids);
  return newSupplier;

  async function runInsertQuery(
    supplierData: Omit<CreateSupplierRequest, "service_ids">,
    service_ids?: number[]
  ) {
    const newSupplier = await prismaClient.supplier.create({
      data: {
        ...supplierData,
        data_cadastro: new Date(),
      },
      include: {
        service_supplier: {
          include: {
            service: true,
          },
        },
      },
    });

    // Associar serviços se fornecidos
    if (service_ids && service_ids.length > 0) {
      await prismaClient.serviceSupplier.createMany({
        data: service_ids.map((serviceId) => ({
          id_supplier: newSupplier.id_supplier,
          id_service: serviceId,
        })),
      });
    }

    // Buscar novamente com os serviços associados
    const supplierWithServices = await prismaClient.supplier.findUnique({
      where: { id_supplier: newSupplier.id_supplier },
      include: {
        service_supplier: {
          include: {
            service: true,
          },
        },
      },
    });

    return supplierWithServices;
  }
}

async function updateById(
  id: string,
  supplierInputValues: UpdateSupplierRequest
) {
  const currentSupplier = await findOneById(id);

  if (Object.keys(supplierInputValues).length === 0) {
    throw new ValidationError({
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  await validateRequiredFields(supplierInputValues);

  // Normalizar email
  if (supplierInputValues.email) {
    supplierInputValues.email = supplierInputValues.email.toLowerCase();
  }

  // Verifica se o email mudou antes de validar unicidade
  if (
    supplierInputValues.email &&
    supplierInputValues.email !== currentSupplier.email
  ) {
    await validateUniqueEmail(supplierInputValues.email);
  }

  // Validações específicas por jurisdição
  if (supplierInputValues.jurisdicao === Jurisdicao.BRASIL) {
    if (supplierInputValues.cnpj) {
      supplierInputValues.cnpj = supplierInputValues.cnpj.replace(/\D/g, "");
      if (supplierInputValues.cnpj !== currentSupplier.cnpj) {
        await validateUniqueCnpj(supplierInputValues.cnpj);
      }
    }
  }

  if (supplierInputValues.jurisdicao === Jurisdicao.SAN_ANDRES) {
    if (
      supplierInputValues.tax_id &&
      supplierInputValues.tax_id !== currentSupplier.tax_id
    ) {
      await validateUniqueTaxId(supplierInputValues.tax_id);
    }
    if (
      supplierInputValues.registro_san &&
      supplierInputValues.registro_san !== currentSupplier.registro_san
    ) {
      await validateUniqueRegistroSan(supplierInputValues.registro_san);
    }
  }

  const { service_ids, ...supplierData } = supplierInputValues;

  const updatedSupplier = await runUpdateQuery(id, supplierData, service_ids);
  return updatedSupplier;

  async function runUpdateQuery(
    id: string,
    updateData: Omit<UpdateSupplierRequest, "service_ids">,
    service_ids?: number[]
  ) {
    // const updatedSupplier = await prismaClient.supplier.update({
    //   where: { id_supplier: id },
    //   data: updateData,
    // });

    // Atualizar serviços associados se fornecidos
    if (service_ids !== undefined) {
      // Remover associações existentes
      await prismaClient.serviceSupplier.deleteMany({
        where: { id_supplier: id },
      });

      // Criar novas associações
      if (service_ids.length > 0) {
        await prismaClient.serviceSupplier.createMany({
          data: service_ids.map((serviceId) => ({
            id_supplier: id,
            id_service: serviceId,
          })),
        });
      }
    }

    // Buscar novamente com os serviços associados
    const supplierWithServices = await prismaClient.supplier.findUnique({
      where: { id_supplier: id },
      include: {
        service_supplier: {
          include: {
            service: true,
          },
        },
      },
    });

    return supplierWithServices;
  }
}

async function findAllWithPagination({
  page = 1,
  perpage = 10,
  search = "",
}: {
  page?: number;
  perpage?: number;
  search?: string;
}) {
  const offset = (page - 1) * perpage;

  const whereClause = search
    ? {
        OR: [
          { nome_fantasia: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { cnpj: { contains: search, mode: "insensitive" as const } },
          { razao_social: { contains: search, mode: "insensitive" as const } },
          { tax_id: { contains: search, mode: "insensitive" as const } },
          { registro_san: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [suppliers, totalCount] = await Promise.all([
    prismaClient.supplier.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { data_cadastro: "desc" },
      include: {
        service_supplier: {
          include: {
            service: true,
          },
        },
      },
    }),
    prismaClient.supplier.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    suppliers,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: string) {
  await findOneById(id);

  const deletedSupplier = await runDeleteQuery(id);
  return deletedSupplier;

  async function runDeleteQuery(id_supplier: string) {
    await findOneById(id_supplier);

    // Remover associações com serviços primeiro
    await prismaClient.serviceSupplier.deleteMany({
      where: { id_supplier },
    });

    const deletedSupplier = await prismaClient.supplier.delete({
      where: { id_supplier },
    });

    return {
      message: "Fornecedor deletado com sucesso.",
      id_supplier: deletedSupplier.id_supplier,
    };
  }
}

async function findOneById(id: string) {
  const supplierFound = await runSelectQuery(id);
  return supplierFound;

  async function runSelectQuery(id: string) {
    const supplier = await prismaClient.supplier.findUnique({
      where: { id_supplier: id },
      include: {
        service_supplier: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundError({
        message: "O fornecedor não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return supplier;
  }
}

async function validateRequiredFields(
  supplierInputValues: CreateSupplierRequest | UpdateSupplierRequest
) {
  if (!supplierInputValues.nome_fantasia) {
    throw new ValidationError({
      message: "Nome fantasia não informado.",
      action: "Informe um nome fantasia para realizar esta operação.",
    });
  }

  if (!supplierInputValues.jurisdicao) {
    throw new ValidationError({
      message: "Jurisdição não informada.",
      action: "Informe uma jurisdição para realizar esta operação.",
    });
  }

  // Validações específicas por jurisdição
  if (supplierInputValues.jurisdicao === Jurisdicao.BRASIL) {
    if (!supplierInputValues.cnpj) {
      throw new ValidationError({
        message: "CNPJ não informado.",
        action: "Informe um CNPJ para fornecedores do Brasil.",
      });
    }
  }

  if (supplierInputValues.jurisdicao === Jurisdicao.SAN_ANDRES) {
    if (!supplierInputValues.tax_id) {
      throw new ValidationError({
        message: "Tax ID não informado.",
        action: "Informe um Tax ID para fornecedores de San Andres.",
      });
    }
  }
}

async function validateUniqueEmail(email: string) {
  const supplierFound = await runSelectQuery(email);
  if (supplierFound) {
    throw new ValidationError({
      message: "Este email já está sendo usado.",
      action: "Informe um email diferente.",
    });
  }

  async function runSelectQuery(email: string) {
    const supplier = await prismaClient.supplier.findFirst({
      where: { email },
    });
    return supplier;
  }
}

async function validateUniqueCnpj(cnpj: string) {
  const supplierFound = await runSelectQuery(cnpj);
  if (supplierFound) {
    throw new ValidationError({
      message: "Este CNPJ já está sendo usado.",
      action: "Informe um CNPJ diferente.",
    });
  }

  async function runSelectQuery(cnpj: string) {
    const supplier = await prismaClient.supplier.findFirst({
      where: { cnpj },
    });
    return supplier;
  }
}

async function validateUniqueTaxId(tax_id: string) {
  const supplierFound = await runSelectQuery(tax_id);
  if (supplierFound) {
    throw new ValidationError({
      message: "Este Tax ID já está sendo usado.",
      action: "Informe um Tax ID diferente.",
    });
  }

  async function runSelectQuery(tax_id: string) {
    const supplier = await prismaClient.supplier.findFirst({
      where: { tax_id },
    });
    return supplier;
  }
}

async function validateUniqueRegistroSan(registro_san: string) {
  const supplierFound = await runSelectQuery(registro_san);
  if (supplierFound) {
    throw new ValidationError({
      message: "Este Registro San já está sendo usado.",
      action: "Informe um Registro San diferente.",
    });
  }

  async function runSelectQuery(registro_san: string) {
    const supplier = await prismaClient.supplier.findFirst({
      where: { registro_san },
    });
    return supplier;
  }
}

const supplierModel = {
  create,
  updateById,
  findAllWithPagination,
  deleteById,
  findOneById,
};

export default supplierModel;
