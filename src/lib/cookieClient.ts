import { getCookie } from "cookies-next";

export function getCookieclient() {
  const token = getCookie("vsc-session");
  return token;
}

export function getUserClient() {
  const id_user = getCookie("vsc-identify");
  return id_user;
}
