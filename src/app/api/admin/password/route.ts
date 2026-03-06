import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * PUT /api/admin/password — change admin password
 * Body: { oldPassword: string, newPassword: string }
 *
 * Verifies old password against:
 *   1. bcrypt hash in Setting table (`admin_password_hash`)
 *   2. Fallback: plain-text ADMIN_PASSWORD from .env
 */
export async function PUT(req: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await req.json().catch(() => ({}));
        const { oldPassword, newPassword } = body as {
            oldPassword?: string;
            newPassword?: string;
        };

        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { error: "Введите текущий и новый пароль" },
                { status: 400 }
            );
        }

        if (newPassword.length < 4) {
            return NextResponse.json(
                { error: "Новый пароль должен содержать минимум 4 символа" },
                { status: 400 }
            );
        }

        // ── Verify old password ───────────────────────────────────────────────────
        const hashSetting = await prisma.setting.findUnique({
            where: { key: "admin_password_hash" },
        });

        let oldPasswordValid = false;

        if (hashSetting?.value) {
            // Compare against bcrypt hash in DB
            oldPasswordValid = await bcrypt.compare(oldPassword, hashSetting.value);
        } else {
            // Fallback: compare against .env plain-text
            const envPassword = process.env.ADMIN_PASSWORD ?? "niva2026";
            oldPasswordValid = oldPassword === envPassword;
        }

        if (!oldPasswordValid) {
            // Delay to slow down brute-force
            await new Promise((r) => setTimeout(r, 500));
            return NextResponse.json(
                { error: "Неверный текущий пароль" },
                { status: 403 }
            );
        }

        // ── Save new password hash ────────────────────────────────────────────────
        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await prisma.setting.upsert({
            where: { key: "admin_password_hash" },
            update: { value: newHash },
            create: { key: "admin_password_hash", value: newHash },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
