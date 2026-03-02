import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { serviceSchema } from "@/lib/schemas";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, "services-write", 30, 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

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
    const updatedService = await prisma.service.update({
      where: { id },
      data: { title, description: description ?? null, price, categoryId: categoryId ?? null, isActive: isActive ?? true },
      include: { category: true },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

const patchSchema = z.object({ isActive: z.boolean() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, "services-write", 30, 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { isActive: parsed.data.isActive },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to toggle service:", error);
    return NextResponse.json({ error: "Failed to toggle service" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, "services-write", 30, 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
