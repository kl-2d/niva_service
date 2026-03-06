import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/recovery — emergency password reset
 * Body: { recoveryToken: string }
 *
 * If the token matches RECOVERY_TOKEN env var,
 * deletes the bcrypt hash from DB so the default .env password is used again.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { recoveryToken } = body as { recoveryToken?: string };

        if (!recoveryToken) {
            return NextResponse.json(
                { error: "Введите токен восстановления" },
                { status: 400 }
            );
        }

        const envToken = process.env.RECOVERY_TOKEN;

        if (!envToken) {
            return NextResponse.json(
                { error: "Функция восстановления не настроена" },
                { status: 503 }
            );
        }

        // Timing-safe comparison would be ideal, but for simplicity:
        if (recoveryToken !== envToken) {
            await new Promise((r) => setTimeout(r, 1000));
            return NextResponse.json(
                { error: "Неверный токен восстановления" },
                { status: 403 }
            );
        }

        // Delete the custom password hash — fallback to .env ADMIN_PASSWORD
        await prisma.setting.deleteMany({
            where: { key: "admin_password_hash" },
        });

        return NextResponse.json({
            success: true,
            message: "Пароль сброшен на значение по умолчанию",
        });
    } catch (error) {
        console.error("Recovery error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
