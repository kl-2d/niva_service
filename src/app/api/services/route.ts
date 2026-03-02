import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { serviceSchema } from "@/lib/schemas";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");

    const isAdmin = searchParams.get("admin") === "true";

    const where: Record<string, unknown> = {};
    if (categorySlug) where.category = { slug: categorySlug };
    if (!isAdmin) where.isActive = true;

    const services = await prisma.service.findMany({
      where,
      include: { category: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    // Rate limit: 30 writes per minute per IP (admin actions)
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = rateLimit(ip, "services-write", 30, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Слишком много запросов. Подождите ${retryAfterSeconds} сек.` },
        { status: 429 }
      );
    }

    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const { title, description, price, categoryId, isActive } = parsed.data;
    const newService = await prisma.service.create({
      data: { title, description: description ?? null, price, categoryId: categoryId ?? null, isActive: isActive ?? true },
      include: { category: true },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
