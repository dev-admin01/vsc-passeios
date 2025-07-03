import prismaClient from "@/prisma";
import { ServiceInputValues } from "@/types/service.types";
import { ValidationError, NotFoundError } from "@/errors/errors";
import { ConvertCurrency } from "@/lib/shared/currencyConverter";

async function create(serviceInputValues: ServiceInputValues) {
  await validateRequiredFields(serviceInputValues);

  serviceInputValues.price = ConvertCurrency.realToCents(
    serviceInputValues.price,
  );

  if (Array.isArray(serviceInputValues.time)) {
    serviceInputValues.time = JSON.stringify(serviceInputValues.time);
  }

  const newService = await runInsertQuery(serviceInputValues);
  return newService;

  async function runInsertQuery(serviceInputValues: any) {
    const newService = await prismaClient.service.create({
      data: serviceInputValues,
    });
    return newService;
  }
}

async function updateById(
  id: number,
  serviceInputValues: ServiceInputValues,
): Promise<ServiceInputValues> {
  await findOneById(id);

  if (Object.keys(serviceInputValues).length === 0) {
    throw new ValidationError({
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  console.log("serviceInputValues 1", serviceInputValues);

  await validateRequiredFields(serviceInputValues);

  serviceInputValues.price = ConvertCurrency.realToCents(
    serviceInputValues.price,
  );

  if (Array.isArray(serviceInputValues.time)) {
    serviceInputValues.time = JSON.stringify(serviceInputValues.time);
  }

  const updateData = {
    ...serviceInputValues,
    updated_at: new Date(),
  };

  const updatedService = await runUpdateQuery(id, updateData);
  console.log("updatedService 2", updatedService);
  return updatedService;

  async function runUpdateQuery(id: number, updateData: any) {
    const updatedService = await prismaClient.service.update({
      where: { id_service: id },
      data: updateData,
    });

    updatedService.price = ConvertCurrency.centsToReal(updatedService.price);

    return updatedService;
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
          { description: { contains: search, mode: "insensitive" as const } },
          { observation: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [services, totalCount] = await Promise.all([
    prismaClient.service.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "asc" },
    }),
    prismaClient.service.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  services.forEach((service) => {
    service.price = ConvertCurrency.centsToReal(service.price);
  });

  return {
    services,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: number) {
  await findOneById(id);

  const deletedService = await runDeleteQuery(id);
  return deletedService;

  async function runDeleteQuery(id_service: number) {
    await findOneById(id_service);

    const deletedService = await prismaClient.service.delete({
      where: { id_service },
    });

    return {
      id_service: deletedService.id_service,
    };
  }
}

async function findOneById(id: number) {
  const serviceFound = await runSelectQuery(id);
  return serviceFound;

  async function runSelectQuery(id: number) {
    const service = await prismaClient.service.findUnique({
      where: { id_service: id },
    });

    if (!service) {
      throw new NotFoundError({
        message: "O serviço não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return service;
  }
}

async function validateRequiredFields(serviceInputValues: ServiceInputValues) {
  if (!serviceInputValues.description) {
    throw new ValidationError({
      message: "Descrição não informada.",
      action: "Informe uma descrição para realizar esta operação.",
    });
  }

  if (!serviceInputValues.type) {
    throw new ValidationError({
      message: "Tipo não informado.",
      action: "Informe um tipo para realizar esta operação.",
    });
  }

  if (!serviceInputValues.price) {
    throw new ValidationError({
      message: "Preço não informado.",
      action: "Informe um preço para realizar esta operação.",
    });
  }

  if (!serviceInputValues.time || serviceInputValues.time.length === 0) {
    throw new ValidationError({
      message: "Horário não informado.",
      action: "Informe pelo menos um horário para realizar esta operação.",
    });
  }

  if (!serviceInputValues.observation) {
    throw new ValidationError({
      message: "Observação não informada.",
      action: "Informe uma observação para realizar esta operação.",
    });
  }
}

const service = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
  findOneById,
};

export default service;
