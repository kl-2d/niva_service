import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { bookingSchema } from "@/lib/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Escapes HTML special chars to prevent XSS in email templates. */
function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    // ── Rate limiting: 5 bookings per 10 min per IP ──────────────────────────
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(ip, "book", 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Слишком много запросов. Попробуйте через ${retryAfterSeconds} сек.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    // ── Input validation (Zod) ───────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Ошибка валидации";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, phone, date, services, totalPrice, carBrand, carPlate, comment } = parsed.data;

    // ── Database Storage ─────────────────────────────────────────────────────
    try {
      await prisma.booking.create({
        data: {
          name,
          phone,
          date: date ?? null,
          services: JSON.stringify(services),
          totalPrice,
          status: "NEW",
          carBrand: carBrand ?? null,
          carPlate: carPlate ?? null,
          comment: comment ?? null,
        },
      });
    } catch (dbError) {
      console.error("Database storage failed:", dbError);
    }

    // ── Email via Resend ─────────────────────────────────────────────────────
    try {
      // esc() sanitizes user input before embedding in HTML
      const serviceList = services
        .map((s) => `<li>${esc(s.title)} — <b>${s.price.toLocaleString("ru-RU")} ₽</b></li>`)
        .join("");

      const recipients = (process.env.MANAGER_EMAIL || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const { data, error } = await resend.emails.send({
        from: "Нива Сервис <onboarding@resend.dev>",
        to: recipients,
        subject: `🔧 Новая заявка с сайта от: ${esc(name)}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1a3a2a;border-bottom:2px solid #e8a000;padding-bottom:8px">
              🔧 Новая заявка на ремонт — Нива Сервис
            </h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#666;width:140px">Клиент:</td><td><b>${esc(name)}</b></td></tr>
              <tr><td style="padding:6px 0;color:#666">Телефон:</td><td><b>${esc(phone)}</b></td></tr>
              <tr><td style="padding:6px 0;color:#666">Желаемая дата:</td><td>${esc(date) || "Не указана"}</td></tr>
              ${carBrand ? `<tr><td style="padding:6px 0;color:#666">Марка авто:</td><td><b>${esc(carBrand)}</b></td></tr>` : ""}
              ${carPlate ? `<tr><td style="padding:6px 0;color:#666">Госномер:</td><td><b>${esc(carPlate)}</b></td></tr>` : ""}
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
