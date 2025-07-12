import prismaClient from "@/prisma";
import { DocumentosPDFInputValues } from "@/types/documentos-pdf.types";
import { ValidationError, NotFoundError } from "@/errors/errors";

async function create(documentoInputValues: DocumentosPDFInputValues) {
  await validateRequiredFields(documentoInputValues);

  const newDocumento = await runInsertQuery(documentoInputValues);
  return newDocumento;

  async function runInsertQuery(
    documentoInputValues: DocumentosPDFInputValues,
  ) {
    const newDocumento = await prismaClient.documentosPDF.create({
      data: documentoInputValues,
    });
    return newDocumento;
  }
}

async function updateById(
  id: string,
  documentoInputValues: DocumentosPDFInputValues,
) {
  await findOneById(id);

  if (Object.keys(documentoInputValues).length === 0) {
    throw new ValidationError({
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  await validateRequiredFields(documentoInputValues);

  const updateData = {
    ...documentoInputValues,
    updated_at: new Date(),
  };

  const updatedDocumento = await runUpdateQuery(id, updateData);
  return updatedDocumento;

  async function runUpdateQuery(id: string, updateData: any) {
    const updatedDocumento = await prismaClient.documentosPDF.update({
      where: { id },
      data: updateData,
    });
    return updatedDocumento;
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
        OR: [{ nome: { contains: search, mode: "insensitive" as const } }],
      }
    : {};

  const [documentos, totalCount] = await Promise.all([
    prismaClient.documentosPDF.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
    }),
    prismaClient.documentosPDF.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    documentos,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function findAll() {
  const documentos = await prismaClient.documentosPDF.findMany({
    orderBy: { created_at: "desc" },
  });

  return documentos;
}

async function deleteById(id: string) {
  await findOneById(id);

  const deletedDocumento = await runDeleteQuery(id);
  return deletedDocumento;

  async function runDeleteQuery(id: string) {
    const deletedDocumento = await prismaClient.documentosPDF.delete({
      where: { id },
    });

    return {
      message: "Documento PDF deletado com sucesso.",
      id: deletedDocumento.id,
    };
  }
}

async function findOneById(id: string) {
  const documentoFound = await runSelectQuery(id);
  return documentoFound;

  async function runSelectQuery(id: string) {
    const documento = await prismaClient.documentosPDF.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundError({
        message: "O documento PDF não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return documento;
  }
}

async function validateRequiredFields(
  documentoInputValues: DocumentosPDFInputValues,
) {
  if (!documentoInputValues.nome) {
    throw new ValidationError({
      message: "Nome não informado.",
      action: "Informe um nome para realizar esta operação.",
    });
  }

  if (!documentoInputValues.arquivo_1_base64) {
    throw new ValidationError({
      message: "Arquivo 1 não informado.",
      action: "Informe o primeiro arquivo para realizar esta operação.",
    });
  }
}

const documentosPDF = {
  create,
  updateById,
  findAllWithPagination,
  findAll,
  deleteById,
  findOneById,
};

export default documentosPDF;
