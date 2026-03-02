import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";

const SESSION_COOKIE = "admin_session";

// ── Brute-force protection ───────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

interface AttemptRecord {
  count: number;
  blockedUntil: number | null;
}
const failedAttempts = new Map<string, AttemptRecord>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();
  const { pathname } = req.nextUrl;

  // Allow login page and auth API unconditionally
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    const res = NextResponse.next();
    res.headers.set("x-pathname", pathname);
    return res;
  }

  // Check IP block
  const record = failedAttempts.get(ip);
  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return NextResponse.redirect(
      new URL(`/admin/login?blocked=1&retry=${retryAfter}`, req.url)
    );
  }

  // Check session cookie — validate with HMAC via Web Crypto (Edge-compatible)
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie?.value) {
    const payload = await verifyTokenEdge(sessionCookie.value);
    if (payload) {
      failedAttempts.delete(ip);
      const res = NextResponse.next();
      res.headers.set("x-pathname", pathname);
      return res;
    }
  }

  // No valid session → increment failed count → redirect to login
  const current = failedAttempts.get(ip) ?? { count: 0, blockedUntil: null };
  current.count++;
  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_DURATION_MS;
  }
  failedAttempts.set(ip, current);

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
