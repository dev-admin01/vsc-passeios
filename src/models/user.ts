import prismaClient from "@/prisma";
import { UserInputValues } from "@/types/user.types";
import { ValidationError, NotFoundError } from "@/errors/errors";
import password from "@/models/password";

async function createUser(userInputValues: UserInputValues) {
  await validadeUniqueEmail(userInputValues);
  await hashPassword(userInputValues);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues: UserInputValues) {
    userInputValues.email = userInputValues.email.toLowerCase();

    const newUser = await prismaClient.user.create({
      data: userInputValues,
    });
    return newUser;
  }
}

async function update(id_user: string, userInputValues: UserInputValues) {
  const currentUser = await findOneById(id_user);

  if ("email" in userInputValues) {
    userInputValues.email = userInputValues.email.toLowerCase();
    if (userInputValues.email !== currentUser.email) {
      await validadeUniqueEmail(userInputValues);
    }
  }

  if ("password" in userInputValues) {
    await hashPassword(userInputValues);
  }

  userInputValues.updated_at = new Date(Date.now());

  const updatedUser = await runUpdateQuery(id_user, userInputValues);
  return updatedUser;

  async function runUpdateQuery(
    id_user: string,
    userInputValues: UserInputValues,
  ) {
    const updatedUser = await prismaClient.user.update({
      where: { id_user },
      data: userInputValues,
    });
    return updatedUser;
  }
}

async function validadeUniqueEmail(userInputValues: UserInputValues) {
  const user = await prismaClient.user.findUnique({
    where: { email: userInputValues.email.toLowerCase() },
  });
  if (user) {
    throw new ValidationError({
      message: "Email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPassword(userInputValues: UserInputValues) {
  if (!userInputValues.password) {
    throw new ValidationError({
      message: "Senha não informada.",
      action: "Informe uma senha para realizar esta operação.",
    });
  }

  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

async function findOneById(id: string) {
  const userFound = await runSelectQuery(id);
  return userFound;

  async function runSelectQuery(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundError({
        message: "O id não foi encontrado no sistema.",
        action: "Verifique se o id está correto.",
      });
    }

    return user;
  }
}

async function findOneByEmail(email: string) {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError({
        message: "O email não foi encontrado no sistema.",
        action: "Verifique se o email está correto.",
      });
    }

    return user;
  }
}

async function deleteUser(id_user: string) {
  const userFound = await findOneById(id_user);

  if (!userFound) {
    console.log("not found");
    throw new NotFoundError({
      message: "O id não foi encontrado no sistema.",
      action: "Verifique se o id está correto.",
    });
  }

  if (userFound.id_position === 1) {
    throw new ValidationError({
      message: "Não é possível deletar o usuário administrador.",
      action: "Utilize outro usuário para realizar esta operação.",
    });
  }

  const deletedUser = await runDeleteQuery(userFound.id_user);
  return deletedUser;

  async function runDeleteQuery(id_user: string) {
    const deletedUser = await prismaClient.user.delete({
      where: { id_user },
    });

    const user = {
      id_user: deletedUser.id_user,
      message: "Usuário deletado com sucesso.",
    };

    return user;
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
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prismaClient.user.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
      select: {
        id_user: true,
        name: true,
        email: true,
        id_position: true,
        ddi: true,
        ddd: true,
        phone: true,
        created_at: true,
        updated_at: true,
        // Não retorna a senha por segurança
      },
    }),
    prismaClient.user.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    users,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

const user = {
  createUser,
  findOneById,
  findOneByEmail,
  findAllWithPagination,
  update,
  delete: deleteUser,
};

export default user;
