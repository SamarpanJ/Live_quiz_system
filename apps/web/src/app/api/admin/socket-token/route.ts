import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * The session cookie is httpOnly, so the browser JS can't read it to authorize
 * the socket. This endpoint hands a valid admin a signed token to present on
 * the realtime `adminJoin` handshake.
 */
export async function GET() {
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  return NextResponse.json({ token: createSessionToken() });
}
