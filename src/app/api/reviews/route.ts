import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** Проверяет, что ссылка — Rutube или YouTube */
function isValidVideoUrl(url: string): boolean {
    const patterns = [
        // Rutube
        /rutube\.ru\/video\/[a-zA-Z0-9]+/,
        /rutube\.ru\/play\/embed\/[a-zA-Z0-9]+/,
        // YouTube (на случай если ссылка всё же от туда)
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    return patterns.some((p) => p.test(url));
}

/** GET /api/reviews — публичный, сортировка по дате (от ранней к актуальной) */
export async function GET() {
    try {
        const reviews = await prisma.videoReview.findMany({
            orderBy: { reviewDate: "desc" },
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

        const { videoUrl, description, reviewDate } = await req.json();

        if (!videoUrl || !reviewDate) {
            return NextResponse.json({ error: "videoUrl и reviewDate обязательны" }, { status: 400 });
        }
        if (!isValidVideoUrl(videoUrl)) {
            return NextResponse.json({ error: "Некорректная ссылка. Принимаются ссылки Rutube и YouTube" }, { status: 400 });
        }

        const review = await prisma.videoReview.create({
            data: { videoUrl, description: description || null, reviewDate },
        });
        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("POST /api/reviews error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
