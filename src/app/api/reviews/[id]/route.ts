import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** DELETE /api/reviews/[id] — удалить отзыв (только admin) */
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        await prisma.videoReview.delete({ where: { id: Number(id) } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/reviews/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/** PUT /api/reviews/[id] — обновить отзыв (только admin) */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        const { youtubeUrl, description, reviewDate } = await req.json();

        const review = await prisma.videoReview.update({
            where: { id: Number(id) },
            data: {
                youtubeUrl: youtubeUrl ?? undefined,
                description: description ?? undefined,
                reviewDate: reviewDate ?? undefined,
            },
        });
        return NextResponse.json(review);
    } catch (error) {
        console.error("PUT /api/reviews/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
