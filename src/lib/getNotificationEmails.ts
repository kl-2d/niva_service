import { prisma } from "@/lib/prisma";

/**
 * Returns notification email recipients.
 * 1. Reads from Setting table (`notification_emails` key — JSON array)
 * 2. Falls back to MANAGER_EMAIL env var (comma-separated)
 * 3. Returns empty array if nothing configured
 */
export async function getNotificationEmails(): Promise<string[]> {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: "notification_emails" },
        });

        if (setting?.value) {
            const parsed = JSON.parse(setting.value) as string[];
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.filter(Boolean);
            }
        }
    } catch {
        // Fall through to env fallback
    }

    // Fallback: env var (comma-separated)
    return (process.env.MANAGER_EMAIL || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
}
