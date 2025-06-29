import prismaClient from "@/prisma";
import { Midia } from "@/types/midia.types";
import { NotFoundError, ValidationError } from "@/errors/errors";

async function create(midiaInputValues: Midia) {
  if (!midiaInputValues.description) {
    throw new ValidationError({
      message: "Dados enviados inválidos",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  await validateByDescription(midiaInputValues.description);

  const midia = runInsertQuery(midiaInputValues);

  async function runInsertQuery(midiaInputValues: Midia) {
    const midia = await prismaClient.midia.create({
      data: midiaInputValues,
    });
    return midia;
  }

  return midia;
}

async function validateByDescription(description: string) {
  const midia = await runFindQuery(description);

  async function runFindQuery(description: string) {
    const midia = await prismaClient.midia.findUnique({
      where: { description },
    });

    if (midia) {
      throw new ValidationError({
        message: "Descrição já cadastrada.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }
    return midia;
  }

  return midia;
}

async function validateById(id: number) {
  console.log("id model", id);
  const validateMidia = await runValidateById(id);

  return validateMidia;

  async function runValidateById(id: number) {
    const midia = await prismaClient.midia.findUnique({
      where: { id_midia: id },
    });

    if (!midia) {
      throw new NotFoundError({
        message: "Mídia não encontrada.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }

    return midia;
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
        description: { contains: search, mode: "insensitive" as const },
      }
    : {};

  const [midias, totalCount] = await Promise.all([
    prismaClient.midia.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { id_midia: "asc" },
    }),
    prismaClient.midia.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    midias,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: number) {
  const validateMidia = await validateById(id);

  const midia = await runDeleteQuery(validateMidia);

  async function runDeleteQuery(validateMidia: Midia) {
    const midia = await prismaClient.midia.delete({
      where: { id_midia: validateMidia.id_midia },
    });
    console.log("midia deletada", midia);

    const deletedMidia = {
      message: "Mídia deletada com sucesso.",
      status_code: 200,
    };
    return deletedMidia;
  }

  return midia;
}

async function updateById(id: number, midiaInputValues: Midia) {
  const validateMidia = await validateById(id);

  await validateByDescription(midiaInputValues.description);

  const midia = await runUpdateQuery(validateMidia);

  async function runUpdateQuery(validateMidia: Midia) {
    const midia = await prismaClient.midia.update({
      where: { id_midia: validateMidia.id_midia },
      data: {
        description: midiaInputValues.description,
      },
    });

    return midia;
  }

  return midia;
}

const midia = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
};

export default midia;
