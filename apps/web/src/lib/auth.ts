import crypto from "node:crypto";

/**
 * Tiny stateless session for the single-admin MVP. We sign a fixed payload with
 * SESSION_SECRET; a valid signed cookie == authenticated admin. No DB needed.
 */

const COOKIE_NAME = "quiz_admin";
const PAYLOAD = "admin";

function secret(): string {
  return process.env.SESSION_SECRET || "insecure-dev-secret";
}

function sign(payload: string): string {
  const sig = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function createSessionToken(): string {
  return sign(PAYLOAD);
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (payload !== PAYLOAD || !sig) return false;
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = (process.env.ADMIN_PASSWORD || "admin123").trim();
  const value = input.trim();
  if (!value || value.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
