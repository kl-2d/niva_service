import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

function getSecret(): Uint8Array {
  const key =
    process.env.SECRET_KEY ??
    process.env.ADMIN_PASSWORD ??
    "change-me-in-env";
  return new TextEncoder().encode(key);
}

/**
 * Signs a JWT token using HS256.
 * Works in Node.js runtime (API routes).
 */
export async function signToken(subject: string): Promise<string> {
  return await new SignJWT({ sub: subject })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

/**
 * Verifies a JWT token.
 * Returns the subject string if valid, or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/**
 * Validates the admin session cookie.
 * Returns null if session is valid, or a 401 NextResponse if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subject = await verifyToken(session.value);
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Valid session
}
