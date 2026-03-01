import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Buffer } from "buffer";

// ── Brute-force protection ───────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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

// ── Timing-safe string comparison ───────────────────────────────────────────
function timingSafeEqual(a: string, b: string): boolean {
  // Pad both to same length to avoid timing differences on length mismatch
  const maxLen = Math.max(a.length, b.length);
  const bufA = Buffer.alloc(maxLen);
  const bufB = Buffer.alloc(maxLen);
  bufA.write(a);
  bufB.write(b);
  // XOR all bytes: if any differ, result will be non-zero
  let diff = 0;
  for (let i = 0; i < maxLen; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();

  // Check if IP is blocked
  const record = failedAttempts.get(ip);
  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: "Слишком много попыток. Попробуйте позже.",
        retryAfterSeconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  // Extract credentials
  const basicAuth = req.headers.get("authorization");
  const adminUser = process.env.ADMIN_USER ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "niva2026";

  if (basicAuth?.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(basicAuth.slice(6), "base64").toString("utf-8");
      const colonIndex = decoded.indexOf(":");
      if (colonIndex === -1) throw new Error("Invalid format");

      const user = decoded.slice(0, colonIndex);
      const pwd = decoded.slice(colonIndex + 1);

      const valid =
        timingSafeEqual(user, adminUser) && timingSafeEqual(pwd, adminPassword);

      if (valid) {
        // Reset on successful login
        failedAttempts.delete(ip);
        return NextResponse.next();
      }
    } catch {
      // malformed base64 — treat as failure
    }
  }

  // Increment failed attempts
  const current = failedAttempts.get(ip) ?? { count: 0, blockedUntil: null };
  current.count++;

  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_DURATION_MS;
    failedAttempts.set(ip, current);

    return new NextResponse("Слишком много попыток. Заблокировано на 15 минут.", {
      status: 429,
      headers: {
        "WWW-Authenticate": 'Basic realm="Нива Сервис Панель"',
        "Retry-After": String(Math.ceil(BLOCK_DURATION_MS / 1000)),
      },
    });
  }

  failedAttempts.set(ip, current);

  const remainingAttempts = MAX_ATTEMPTS - current.count;
  return new NextResponse(
    `Требуется авторизация. Осталось попыток: ${remainingAttempts}`,
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Нива Сервис Панель"',
      },
    }
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};
