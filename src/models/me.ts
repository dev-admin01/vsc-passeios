import database from "@/infra/database";
import { ValidationError } from "@/infra/errors";

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
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "utilize outro email para realizar o cadastro.",
      });
    }

    return results.rows[0];
  }
  console.log(user);
  return user;
}

const me = {
  DetailUser,
};

export default me;
