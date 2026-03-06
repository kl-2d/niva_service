import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** GET /api/bookings — returns all bookings ordered by createdAt desc.
 *  Used by BookingsPanel polling for real-time updates.
 *  Requires admin session. */
export async function GET() {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error("GET /api/bookings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
