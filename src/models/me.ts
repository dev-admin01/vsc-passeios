import database from "@/infra/database";
import { InvalidTokenError } from "@/infra/errors";

async function DetailUser(id_user: string) {
  const user = await findUser(id_user);

  async function findUser(id_user: string) {
    const results = await database.query({
      text: `
                  SELECT
                   id_user, name, email, id_position
                  from
                   users
                  where
                   id_user = $1
                  ;`,
      values: [id_user],
    });
    if (results.rowCount! < 1) {
      throw new InvalidTokenError({
        message: "Token de verificação inválido.",
        action:
          "Efetue o processo de autenticação para acessar as rotas privadas.",
      });
    }

    return results.rows[0];
  }
  return user;
}

const me = {
  DetailUser,
};

export default me;
