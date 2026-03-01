import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, carBrand, carPlate } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    // --- Database Storage ---
    try {
      await prisma.booking.create({
        data: {
          name,
          phone,
          date: null,
          services: JSON.stringify("callback"),
          totalPrice: 0,
          status: "CALLBACK",
          carBrand: carBrand || null,
          carPlate: carPlate || null,
        },
      });
    } catch (dbError) {
      console.error("DB error (callback):", dbError);
    }

    // --- Email via Resend ---
    try {
      const recipients = (process.env.MANAGER_EMAIL || "").split(",").map(e => e.trim()).filter(Boolean);
      const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

      const { data, error } = await resend.emails.send({
        from: "Нива Сервис <onboarding@resend.dev>",
        to: recipients,
        subject: `📞 Заявка на звонок от: ${name} (${phone})`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1a3a2a;border-bottom:2px solid #e8a000;padding-bottom:8px">
              📞 Заявка на звонок — Нива Сервис
            </h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#666;width:140px">Клиент:</td><td><b>${name}</b></td></tr>
              <tr><td style="padding:6px 0;color:#666">Телефон:</td><td><b><a href="tel:${phone}">${phone}</a></b></td></tr>
              ${carBrand ? `<tr><td style="padding:6px 0;color:#666">Марка авто:</td><td><b>${carBrand}</b></td></tr>` : ""}
              ${carPlate ? `<tr><td style="padding:6px 0;color:#666">Госномер:</td><td><b>${carPlate}</b></td></tr>` : ""}
              <tr><td style="padding:6px 0;color:#666">Время заявки:</td><td>${now}</td></tr>
            </table>
            <div style="margin-top:20px;padding:12px 16px;background:#fff8e8;border-left:4px solid #e8a000;border-radius:4px">
              Клиент ожидает обратного звонка. Свяжитесь как можно скорее.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Resend callback error:", JSON.stringify(error, null, 2));
      } else {
        console.log("Callback email sent via Resend to:", recipients, "| id:", data?.id);
      }
    } catch (emailError) {
      console.error("Resend callback failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Callback API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
