import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 часов

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body as { username?: string; password?: string };

    const adminUser = process.env.ADMIN_USER ?? "admin";

    if (username !== adminUser) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    // ── Password verification: DB hash → .env fallback ────────────────────────
    let passwordValid = false;

    try {
      const hashSetting = await prisma.setting.findUnique({
        where: { key: "admin_password_hash" },
      });

      if (hashSetting?.value && password) {
        passwordValid = await bcrypt.compare(password, hashSetting.value);
      } else {
        // No hash in DB yet — use .env plain-text
        const envPassword = process.env.ADMIN_PASSWORD ?? "niva2026";
        passwordValid = password === envPassword;
      }
    } catch {
      // DB error — fallback to .env
      const envPassword = process.env.ADMIN_PASSWORD ?? "niva2026";
      passwordValid = password === envPassword;
    }

    if (!passwordValid) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = await signToken(`${adminUser}:${Date.now()}`);

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, {
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

// Выход: удалить куки
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

