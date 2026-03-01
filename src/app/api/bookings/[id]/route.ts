import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_CYCLE: Record<string, string> = {
  NEW: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "NEW",
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextStatus = STATUS_CYCLE[booking.status] ?? "NEW";
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: nextStatus },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
