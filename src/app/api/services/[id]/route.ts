import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    const body = await request.json();
    const { title, description, price, category } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        price: parseInt(price, 10),
        category,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
