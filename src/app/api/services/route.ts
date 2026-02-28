import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
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
    const { title, description, price, category } = body;

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price: parseInt(price, 10),
        category: category || "engine",
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
