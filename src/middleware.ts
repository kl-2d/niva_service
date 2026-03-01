import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Buffer } from "buffer";

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

export function middleware(req: NextRequest) {
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

  // Check session cookie
  const sessionCookie = req.cookies.get(SESSION_COOKIE);

  if (sessionCookie?.value) {
    // Cookie exists — validate it's not obviously tampered (basic check)
    try {
      const decoded = Buffer.from(sessionCookie.value, "base64url").toString("utf-8");
      if (decoded.includes(":")) {
        // Valid structure — allow access
        failedAttempts.delete(ip);
        const res = NextResponse.next();
        res.headers.set("x-pathname", pathname);
        return res;
      }
    } catch {
      // Malformed cookie — fall through to redirect
    }
  }

  // No valid session → redirect to login
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
