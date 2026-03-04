/**
 * Edge-compatible token verification using jose (works in Edge Runtime).
 * This file is safe to import in Next.js middleware.
 * For API routes (Node.js runtime), use lib/auth.ts instead.
 */
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const key =
    process.env.SECRET_KEY ??
    process.env.ADMIN_PASSWORD ??
    "change-me-in-env";
  return new TextEncoder().encode(key);
}

/**
 * Verifies a JWT token in Edge Runtime using jose.
 * Returns the subject string if valid, or null if invalid/expired.
 */
export async function verifyTokenEdge(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
