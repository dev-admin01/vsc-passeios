import { deleteCookie, getCookie } from "cookies-next";

export function getCookieclient() {
  const token = getCookie("vsc-session");
  return token;
}
export function deleteCookieClient() {
  deleteCookie("vsc-session");
  deleteCookie("vsc-identify");
}

export function getUserClient() {
  const id_user = getCookie("vsc-identify");
  const user = JSON.parse(id_user as string);
  return user;
}
