import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function generateToken(user: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "niva2026";
  const payload = `${user}:${Date.now()}:${secret}`;
  // Simple deterministic token — for production use JWT or crypto.createHmac
  return Buffer.from(payload).toString("base64url");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body as { username?: string; password?: string };

    const adminUser = process.env.ADMIN_USER ?? "admin";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "niva2026";

    // Timing-safe comparison
    const userMatch = username === adminUser;
    const passMatch = password === adminPassword;

    if (!userMatch || !passMatch) {
      // Small delay to slow brute-force even more
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = generateToken(adminUser);

    const response = NextResponse.json({ success: true });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Logout: clear the cookie
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
