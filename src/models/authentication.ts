import user from "./user";
import password from "./password";
import { SignJWT, jwtVerify } from "jose";
import { UnauthorizedError } from "../errors/errors";
import { User } from "../types/user.types";

async function getAuthenticatedUser(
  providedEmail: string,
  providedPassword: string,
) {
  try {
    const storedUser = await user.findOneByEmail(providedEmail);

    await validatePassword(providedPassword, storedUser?.password);

    return storedUser;
  } catch (error) {
    console.error("Error in getAuthenticatedUser:", error);
    throw new UnauthorizedError({
      message: "Dados de autenticação não conferem.",
      action: "Verifique se o email e a senha estão corretos.",
    });
  }
}

async function validatePassword(
  providedPassword: string,
  storedPassword: string,
) {
  const passwordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!passwordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se este dado está correto.",
    });
  }
}

async function generateToken(authenticatedUser: User) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const token = await new SignJWT({
    name: authenticatedUser.name,
    email: authenticatedUser.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(authenticatedUser.id_user!)
    .setExpirationTime("1d")
    .sign(secret);

  return token;
}

async function validateToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

const authentication = {
  getAuthenticatedUser,
  generateToken,
  validateToken,
};

export default authentication;
