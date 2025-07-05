import { deleteCookie, getCookie } from "cookies-next";

export function getCookieclient() {
  const token = getCookie("vsc-session");
  return token;
}
export function deleteCookieClient() {
  deleteCookie("vsc-session");
}
