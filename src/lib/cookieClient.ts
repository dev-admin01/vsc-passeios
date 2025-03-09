import { getCookie } from "cookies-next";

export function getCookieclient() {
  const token = getCookie("vsc-session");
  return token;
}
