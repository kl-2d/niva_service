import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");

    const services = await prisma.service.findMany({
      where: categorySlug
        ? { category: { slug: categorySlug } }
        : undefined,
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
  try {
    const body = await request.json();
    const { title, description, price, categoryId } = body;

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price: parseInt(price, 10),
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
      },
      include: { category: true },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
