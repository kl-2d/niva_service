import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/settings — returns current settings (notification emails)
 */
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const emailsSetting = await prisma.setting.findUnique({
            where: { key: "notification_emails" },
        });

        let emails: string[] = [];
        if (emailsSetting?.value) {
            try {
                emails = JSON.parse(emailsSetting.value);
            } catch {
                emails = [];
            }
        } else {
            // Fallback: populate from env
            emails = (process.env.MANAGER_EMAIL || "")
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean);
        }

        return NextResponse.json({ emails });
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * PUT /api/admin/settings — update notification emails
 * Body: { emails: string[] }
 */
export async function PUT(req: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await req.json().catch(() => ({}));
        const { emails } = body as { emails?: string[] };

        if (!Array.isArray(emails)) {
            return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
        }

        // Validate each email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = emails.map((e) => e.trim()).filter(Boolean);

        for (const email of validEmails) {
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: `Некорректный email: ${email}` },
                    { status: 400 }
                );
            }
        }

        await prisma.setting.upsert({
            where: { key: "notification_emails" },
            update: { value: JSON.stringify(validEmails) },
            create: { key: "notification_emails", value: JSON.stringify(validEmails) },
        });

        return NextResponse.json({ success: true, emails: validEmails });
    } catch (error) {
        console.error("Settings PUT error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
