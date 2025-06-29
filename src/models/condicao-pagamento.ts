import prismaClient from "@/prisma";
import {
  CondicaoPagamento,
  CondicaoPagamentoInputValues,
} from "@/types/condicao-pagamento.types";
import { NotFoundError, ValidationError } from "@/errors/errors";

async function create(condicaoInputValues: CondicaoPagamentoInputValues) {
  if (!condicaoInputValues.description) {
    throw new ValidationError({
      message: "Descrição não informada.",
      action: "Informe uma descrição para realizar esta operação.",
    });
  }

  await validateByDescription(condicaoInputValues.description);

  const condicao = await runInsertQuery(condicaoInputValues);

  async function runInsertQuery(
    condicaoInputValues: CondicaoPagamentoInputValues,
  ) {
    const condicao = await prismaClient.condicaoPagamento.create({
      data: condicaoInputValues,
    });
    return condicao;
  }

  return condicao;
}

async function validateByDescription(description: string) {
  const condicao = await runFindQuery(description);

  async function runFindQuery(description: string) {
    const condicao = await prismaClient.condicaoPagamento.findUnique({
      where: { description },
    });

    if (condicao) {
      throw new ValidationError({
        message: "Descrição já cadastrada.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }
    return condicao;
  }

  return condicao;
}

async function validateById(id: string) {
  const validateCondicao = await runValidateById(id);

  return validateCondicao;

  async function runValidateById(id: string) {
    const condicao = await prismaClient.condicaoPagamento.findUnique({
      where: { id_cond_pag: id },
    });

    if (!condicao) {
      throw new NotFoundError({
        message: "Condição de pagamento não encontrada.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }

    return condicao;
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

  const [condicoesPagamento, totalCount] = await Promise.all([
    prismaClient.condicaoPagamento.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
    }),
    prismaClient.condicaoPagamento.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    condicoesPagamento,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: string) {
  const validateCondicao = await validateById(id);

  const condicao = await runDeleteQuery(validateCondicao);

  async function runDeleteQuery(validateCondicao: CondicaoPagamento) {
    await prismaClient.condicaoPagamento.delete({
      where: { id_cond_pag: validateCondicao.id_cond_pag },
    });

    const deletedCondicao = {
      message: "Condição de pagamento deletada com sucesso.",
      status_code: 200,
    };
    return deletedCondicao;
  }

  return condicao;
}

async function updateById(
  id: string,
  condicaoInputValues: CondicaoPagamentoInputValues,
) {
  if (
    !condicaoInputValues.description ||
    !condicaoInputValues.installments ||
    !condicaoInputValues.discount
  ) {
    throw new ValidationError({
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  const storedCondicao = await validateById(id);

  if (storedCondicao.description !== condicaoInputValues.description) {
    await validateByDescription(condicaoInputValues.description);
  }

  const condicao = await runUpdateQuery(storedCondicao);

  async function runUpdateQuery(storedCondicao: CondicaoPagamento) {
    const condicao = await prismaClient.condicaoPagamento.update({
      where: { id_cond_pag: storedCondicao.id_cond_pag },
      data: condicaoInputValues,
    });

    return condicao;
  }

  return condicao;
}

const condicaoPagamento = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
};

export default condicaoPagamento;
