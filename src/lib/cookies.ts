import Cookies from "js-cookie";

export function getCookieclient(name: string): string | undefined {
  return Cookies.get(name);
}

export function setCookieclient(
  name: string,
  value: string,
  options?: Cookies.CookieAttributes,
): string | undefined {
  return Cookies.set(name, value, options);
}

export function removeCookieclient(
  name: string,
  options?: Cookies.CookieAttributes,
): void {
  Cookies.remove(name, options);
}
