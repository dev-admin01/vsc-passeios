import database from "@/infra/database";
import { ValidationError } from "@/infra/errors";
import { createUserInput } from "@/types/user.types";
import { hash } from "bcrypt";

async function create(userInputValue: createUserInput) {
  await validadeUniqueEmail(userInputValue.email);

  const passwordHash = await hashPassword(userInputValue.password);
  userInputValue.password = passwordHash;

  const newUser = await runInsertQuery(userInputValue);
  return newUser;

  async function runInsertQuery(userInputValue: createUserInput) {
    const results = await database.query({
      text: `
                INSERT INTO
                 users (name, email, password, id_position, ddi, ddd, phone) 
                VALUES
                 ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING
                  id_user, name, email, id_position, ddi, ddd, phone, created_at, updated_at
                  ;`,
      values: [
        userInputValue.name,
        userInputValue.email,
        userInputValue.password,
        userInputValue.id_position,
        userInputValue.ddi,
        userInputValue.ddd,
        userInputValue.phone,
      ],
    });
    return results.rows[0];
  }

  async function validadeUniqueEmail(email: string) {
    const results = await database.query({
      text: `
                SELECT 
                 email
                from
                 users
                where
                 LOWER(email) = LOWER($1)
                ;`,
      values: [email],
    });

    if (results.rowCount! > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function hashPassword(password: string) {
    const hashPassword = await hash(password, 8);
    return hashPassword;
  }
}

const user = {
  create,
};

export default user;
