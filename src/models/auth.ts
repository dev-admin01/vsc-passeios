import database from "@/infra/database";

import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { ValidationError } from "@/infra/errors";

import { authUserInput, User } from "@/types/user.types";

async function singIn(userInput: authUserInput) {
  const userVerify = await verifyEmail(userInput.email);

  await verifyPassword(userVerify.password, userInput.password);

  const token = await generateJWT(userVerify);

  const user = {
    id_user: userVerify.id_user,
    name: userVerify.name,
    email: userVerify.email,
    id_position: userVerify.id_position,
    token,
  };

  return user;

  async function verifyEmail(email: string) {
    const results = await database.query({
      text: `SELECT 
              id_user, name, email, password, id_position 
            FROM
             users 
            WHERE 
              email = $1;`,
      values: [email],
    });

    if (results.rowCount! < 1) {
      throw new ValidationError({
        message: "Email ou senha inválidos.",
        action: "Tente novamente mais tarde.",
      });
    }

    return results.rows[0];
  }
}

async function verifyPassword(bdPassword: string, inputPassword: string) {
  const passwordMatch = await compare(inputPassword, bdPassword);
  if (!passwordMatch) {
    throw new ValidationError({
      message: "Email ou senha inválidos.",
      action: "Tente novamente mais tarde.",
    });
  }
}

async function generateJWT(user: User) {
  const token = sign(
    {
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      subject: user.id_user,
      expiresIn: "15d",
    }
  );
  return token;
}

const auth = {
  singIn,
};

export default auth;
