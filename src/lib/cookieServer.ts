import { cookies } from "next/headers";

export async function getCookieServer() {
  const cookieStores = await cookies();
  const token = cookieStores.get("vsc-session")?.value;

  return token || null;
}
