import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { promoSchema } from "@/lib/schemas";

/** Проверяет, актуальна ли акция по датам */
function isPromoCurrentlyActive(promo: {
    isActive: boolean;
    eventDateStart: string | null;
    eventDate: string | null;
}): boolean {
    if (!promo.isActive) return false;
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (promo.eventDateStart && today < promo.eventDateStart) return false;
    if (promo.eventDate && today > promo.eventDate) return false;
    return true;
}

/** GET /api/promo — публичный маршрут. Возвращает акцию + поле effectiveActive */
export async function GET() {
    try {
        let promo = await prisma.promoEvent.findFirst({ orderBy: { id: "asc" } });
        if (!promo) {
            promo = await prisma.promoEvent.create({
                data: {
                    title: "Бесплатная диагностика",
                    description: "Запишитесь на бесплатный комплексный осмотр вашего автомобиля",
                    isActive: false,
                    eventDateStart: null,
                    eventDate: null,
                },
            });
        }

        // Авто-деактивация: если дата окончания прошла — сбрасываем isActive в БД
        if (promo.isActive && promo.eventDate) {
            const today = new Date().toISOString().slice(0, 10);
            if (today > promo.eventDate) {
                promo = await prisma.promoEvent.update({
                    where: { id: promo.id },
                    data: { isActive: false },
                });
            }
        }

        return NextResponse.json({
            ...promo,
            effectiveActive: isPromoCurrentlyActive(promo),
        });
    } catch (error) {
        console.error("GET /api/promo error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/** PUT /api/promo — только для авторизованных */
export async function PUT(req: Request) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const body = await req.json();
        const parsed = promoSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
                { status: 400 }
            );
        }
        const { title, description, isActive, eventDateStart, eventDate } = parsed.data;

        let promo = await prisma.promoEvent.findFirst({ orderBy: { id: "asc" } });
        if (!promo) {
            promo = await prisma.promoEvent.create({
                data: {
                    title: title ?? "Бесплатная диагностика",
                    description: description ?? null,
                    isActive: isActive ?? false,
                    eventDateStart: eventDateStart ?? null,
                    eventDate: eventDate ?? null,
                },
            });
        } else {
            promo = await prisma.promoEvent.update({
                where: { id: promo.id },
                data: {
                    title: title ?? promo.title,
                    description: description !== undefined ? description : promo.description,
                    isActive: isActive !== undefined ? isActive : promo.isActive,
                    eventDateStart: eventDateStart !== undefined ? eventDateStart : promo.eventDateStart,
                    eventDate: eventDate !== undefined ? eventDate : promo.eventDate,
                },
            });
        }

        return NextResponse.json(promo);
    } catch (error) {
        console.error("PUT /api/promo error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
