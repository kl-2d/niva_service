import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

const SESSION_COOKIE = "admin_session";

/**
 * Validates the admin session cookie.
 * Returns null if the session is valid, or a 401 NextResponse if not.
 * Usage in API routes:
 *   const unauth = await requireAdmin();
 *   if (unauth) return unauth;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = Buffer.from(session.value, "base64url").toString("utf-8");
    if (decoded.includes(":")) {
      return null; // Valid session
    }
  } catch {
    // Malformed cookie
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
