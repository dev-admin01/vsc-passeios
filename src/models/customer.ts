import prismaClient from "@/prisma";
import { CustomerInputValues } from "@/types/customer.types";
import { ValidationError, NotFoundError } from "@/errors/errors";

async function create(customerInputValues: CustomerInputValues) {
  await validateRequiredFields(customerInputValues);

  if (customerInputValues.email) {
    customerInputValues.email = customerInputValues.email.toLowerCase();
    await validateUniqueEmail(customerInputValues.email);
  }

  if (customerInputValues.cpf_cnpj) {
    customerInputValues.cpf_cnpj = customerInputValues.cpf_cnpj.replace(
      /\D/g,
      "",
    );
    await validateUniqueCpfCnpj(customerInputValues.cpf_cnpj);
  }

  if (customerInputValues.rg) {
    await validateUniqueRg(customerInputValues.rg);
  }

  const newCustomer = await runInsertQuery(customerInputValues);
  return newCustomer;

  async function runInsertQuery(customerInputValues: CustomerInputValues) {
    const newCustomer = await prismaClient.customer.create({
      data: customerInputValues,
    });
    return newCustomer;
  }
}

async function updateById(
  id: string,
  customerInputValues: CustomerInputValues,
) {
  const currentCustomer = await findOneById(id);

  if (Object.keys(customerInputValues).length === 0) {
    throw new ValidationError({
      message: "Todos os campos são obrigatórios.",
      action: "Ajuste os dados informados e tente novamente.",
    });
  }

  await validateRequiredFields(customerInputValues);

  // Normalizar email
  if (customerInputValues.email) {
    customerInputValues.email = customerInputValues.email.toLowerCase();
  }

  // Verifica se o email mudou antes de validar unicidade
  if (
    customerInputValues.email &&
    customerInputValues.email !== currentCustomer.email
  ) {
    await validateUniqueEmail(customerInputValues.email);
  }

  // Verifica se o CPF/CNPJ mudou antes de validar unicidade
  customerInputValues.cpf_cnpj = customerInputValues?.cpf_cnpj?.replace(
    /\D/g,
    "",
  );
  if (
    customerInputValues.cpf_cnpj &&
    customerInputValues.cpf_cnpj !== currentCustomer.cpf_cnpj
  ) {
    await validateUniqueCpfCnpj(customerInputValues.cpf_cnpj);
  }

  if (customerInputValues.rg && customerInputValues.rg !== currentCustomer.rg) {
    await validateUniqueRg(customerInputValues.rg);
  }

  const updateData = {
    ...customerInputValues,
    updated_at: new Date(),
  };

  const updatedCustomer = await runUpdateQuery(id, updateData);
  return updatedCustomer;

  async function runUpdateQuery(id: string, updateData: any) {
    const updatedCustomer = await prismaClient.customer.update({
      where: { id_customer: id },
      data: updateData,
    });
    return updatedCustomer;
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
          { nome: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { cpf_cnpj: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, totalCount] = await Promise.all([
    prismaClient.customer.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
    }),
    prismaClient.customer.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    customers,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: string) {
  await findOneById(id);

  const deletedCustomer = await runDeleteQuery(id);
  return deletedCustomer;

  async function runDeleteQuery(id_customer: string) {
    await findOneById(id_customer);

    const deletedCustomer = await prismaClient.customer.delete({
      where: { id_customer },
    });

    return {
      message: "Cliente deletado com sucesso.",
      id_customer: deletedCustomer.id_customer,
    };
  }
}

async function findOneById(id: string) {
  const customerFound = await runSelectQuery(id);
  return customerFound;

  async function runSelectQuery(id: string) {
    const customer = await prismaClient.customer.findUnique({
      where: { id_customer: id },
    });

    if (!customer) {
      throw new NotFoundError({
        message: "O cliente não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return customer;
  }
}

async function validateRequiredFields(
  customerInputValues: CustomerInputValues,
) {
  if (!customerInputValues.nome) {
    throw new ValidationError({
      message: "Nome não informado.",
      action: "Informe um nome para realizar esta operação.",
    });
  }

  if (!customerInputValues.email) {
    throw new ValidationError({
      message: "Email não informado.",
      action: "Informe um email para realizar esta operação.",
    });
  }

  if (!customerInputValues.cpf_cnpj) {
    throw new ValidationError({
      message: "CPF/CNPJ não informado.",
      action: "Informe um CPF/CNPJ para realizar esta operação.",
    });
  }

  if (!customerInputValues.telefone) {
    throw new ValidationError({
      message: "Telefone não informado.",
      action: "Informe um telefone para realizar esta operação.",
    });
  }
}

async function validateUniqueEmail(email: string) {
  const customer = await runSelectQuery(email);
  return customer;

  async function runSelectQuery(email: string) {
    const customer = await prismaClient.customer.findUnique({
      where: { email: email },
    });

    if (customer) {
      throw new ValidationError({
        message: "Email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
      });
    }
  }
}

async function validateUniqueCpfCnpj(cpf_cnpj: string) {
  const customer = await runSelectQuery(cpf_cnpj);
  return customer;

  async function runSelectQuery(cpf_cnpj: string) {
    const customer = await prismaClient.customer.findUnique({
      where: { cpf_cnpj },
    });

    if (customer) {
      throw new ValidationError({
        message: "CPF/CNPJ informado já está sendo utilizado.",
        action: "Utilize outro CPF/CNPJ para realizar esta operação.",
      });
    }

    return customer;
  }
}

async function validateUniqueRg(rg: string) {
  const customer = await runSelectQuery(rg);
  return customer;

  async function runSelectQuery(rg: string) {
    const customer = await prismaClient.customer.findUnique({
      where: { rg },
    });

    if (customer) {
      throw new ValidationError({
        message: "RG informado já está sendo utilizado.",
        action: "Utilize outro RG para realizar esta operação.",
      });
    }

    return customer;
  }
}

const customer = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
  findOneById,
};

export default customer;
