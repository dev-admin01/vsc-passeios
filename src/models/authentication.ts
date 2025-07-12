import user from "./user";
import password from "./password";
import { SignJWT, jwtVerify } from "jose";
import { UnauthorizedError } from "../errors/errors";
import { AuthenticatedUser } from "../types/user.types";

async function getAuthenticatedUser(
  providedEmail: string,
  providedPassword: string,
) {
  try {
    const storedUser = await user.findOneByEmail(providedEmail);

    await validatePassword(providedPassword, storedUser?.password);

    if (!storedUser?.active) {
      throw new UnauthorizedError({
        message: "Usuário não está ativo.",
        action: "Verifique se o usuário está ativo.",
      });
    }

    const authenticatedUser = {
      id_user: storedUser?.id_user,
      name: storedUser?.name,
      email: storedUser?.email,
      id_position: storedUser?.id_position,
      active: storedUser?.active,
    };
    return authenticatedUser;
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

async function generateToken(authenticatedUser: AuthenticatedUser) {
  const secret = hexToUint8Array(process.env.JWT_SECRET!);

  const token = await new SignJWT({
    id_user: authenticatedUser.id_user,
    name: authenticatedUser.name,
    email: authenticatedUser.email,
    active: authenticatedUser.active, // INCLUA O STATUS 'active' NO TOKEN
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(authenticatedUser.id_user!)
    .setExpirationTime("1d")
    .sign(secret);

  return token;
}

async function validateToken(token: string) {
  if (!token) {
    return false;
  }

  const secret = hexToUint8Array(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  if (!payload || !payload.sub) {
    return false;
  }

  const storedUser = await user.findOneById(payload.id_user as string);

  if (!storedUser?.active) {
    throw new UnauthorizedError({
      message: "Usuário não está ativo.",
      action: "Verifique se o usuário está ativo.",
    });
  }

  return payload.id_user;
}

function hexToUint8Array(hexString: string) {
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const authentication = {
  getAuthenticatedUser,
  generateToken,
  validateToken,
};

export default authentication;
