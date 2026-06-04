import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Returns true when the request carries a valid admin session cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
