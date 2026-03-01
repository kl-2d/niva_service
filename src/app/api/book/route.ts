import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, date, services, totalPrice, carBrand, carPlate } = body;

    if (!name || !phone || !services || services.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Database Storage ---
    try {
      await prisma.booking.create({
        data: {
          name,
          phone,
          date,
          services: JSON.stringify(services),
          totalPrice,
          status: "NEW",
          carBrand: carBrand || null,
          carPlate: carPlate || null,
        },
      });
    } catch (dbError) {
      console.error("Database storage failed:", dbError);
    }

    // --- Email via Resend ---
    try {
      const serviceList = (services as { title: string; price: number }[])
        .map((s) => `<li>${s.title} — <b>${s.price.toLocaleString("ru-RU")} ₽</b></li>`)
        .join("");

      const recipients = (process.env.MANAGER_EMAIL || "").split(",").map(e => e.trim()).filter(Boolean);

      const { data, error } = await resend.emails.send({
        from: "Нива Сервис <onboarding@resend.dev>",
        to: recipients,
        subject: `🔧 Новая заявка с сайта от: ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1a3a2a;border-bottom:2px solid #e8a000;padding-bottom:8px">
              🔧 Новая заявка на ремонт — Нива Сервис
            </h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#666;width:140px">Клиент:</td><td><b>${name}</b></td></tr>
              <tr><td style="padding:6px 0;color:#666">Телефон:</td><td><b>${phone}</b></td></tr>
              <tr><td style="padding:6px 0;color:#666">Желаемая дата:</td><td>${date || "Не указана"}</td></tr>
              ${carBrand ? `<tr><td style="padding:6px 0;color:#666">Марка авто:</td><td><b>${carBrand}</b></td></tr>` : ""}
              ${carPlate ? `<tr><td style="padding:6px 0;color:#666">Госномер:</td><td><b>${carPlate}</b></td></tr>` : ""}
            </table>
            <h3 style="margin-top:20px;color:#1a3a2a">Выбранные услуги:</h3>
            <ul style="padding-left:20px;line-height:1.8">${serviceList}</ul>
            <div style="margin-top:16px;padding:12px 16px;background:#f5f5f0;border-left:4px solid #e8a000;border-radius:4px">
              <b>Итого: ${Number(totalPrice).toLocaleString("ru-RU")} ₽</b>
            </div>
            <p style="margin-top:20px;color:#999;font-size:12px">
              ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend book error:", JSON.stringify(error, null, 2));
      } else {
        console.log("Email sent via Resend to:", recipients, "| id:", data?.id);
      }
    } catch (emailError) {
      console.error("Resend email failed:", emailError);
    }

    return NextResponse.json({ success: true, message: "Booking received" });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
