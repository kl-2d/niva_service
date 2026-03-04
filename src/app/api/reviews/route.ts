import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** Извлекает YouTube video ID из URL */
function extractYoutubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

/** GET /api/reviews — публичный, сортировка по дате (от ранней к актуальной) */
export async function GET() {
    try {
        const reviews = await prisma.videoReview.findMany({
            orderBy: { reviewDate: "asc" },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("GET /api/reviews error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/** POST /api/reviews — добавить отзыв (только admin) */
export async function POST(req: Request) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { youtubeUrl, description, reviewDate } = await req.json();

        if (!youtubeUrl || !reviewDate) {
            return NextResponse.json({ error: "youtubeUrl и reviewDate обязательны" }, { status: 400 });
        }
        if (!extractYoutubeId(youtubeUrl)) {
            return NextResponse.json({ error: "Некорректная ссылка YouTube" }, { status: 400 });
        }

        const review = await prisma.videoReview.create({
            data: { youtubeUrl, description: description || null, reviewDate },
        });
        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("POST /api/reviews error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
