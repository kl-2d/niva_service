import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/bookings — returns all bookings ordered by createdAt desc.
 *  Used by BookingsPanel polling for real-time updates. */
export async function GET() {
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
