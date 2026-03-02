import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "admin_session";

/**
 * Signs a payload with HMAC-SHA256 using SECRET_KEY env var.
 * Token format: base64url(payload) + "." + base64url(signature)
 */
export function signToken(payload: string): string {
  const secret = process.env.SECRET_KEY ?? process.env.ADMIN_PASSWORD ?? "change-me-in-env";
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

/**
 * Verifies an HMAC-signed token.
 * Returns the payload string if valid, or null if tampered/invalid.
 */
export function verifyToken(token: string): string | null {
  try {
    const [encodedPayload, sig] = token.split(".");
    if (!encodedPayload || !sig) return null;

    const payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const secret = process.env.SECRET_KEY ?? process.env.ADMIN_PASSWORD ?? "change-me-in-env";
    const expectedSig = createHmac("sha256", secret).update(payload).digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates the admin session cookie.
 * Returns null if the session is valid, or a 401 NextResponse if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(session.value);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Valid session
}
