import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, date, services, totalPrice } = body;

    // Validate request
    if (!name || !phone || !services || services.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- STUB: Email Sending Logic ---
    console.log("====================================");
    console.log("📧 STUB: Sending Email Notification to Manager");
    console.log(`To: niva-service@example.com`);
    console.log(`Subject: Новая заявка от ${name}`);
    console.log(`
      Имя: ${name}
      Телефон: ${phone}
      Дата: ${date || "Не указана"}
      
      Услуги:
      ${services.map((s: any) => `- ${s.title} (${s.price} ₽)`).join('\n')}
      
      Итоговая предварительная сумма: ${totalPrice} ₽
    `);
    console.log("====================================");

    // --- STUB: Google Sheets Integration ---
    console.log("====================================");
    console.log("📊 STUB: Appending Row to Google Sheets");
    console.log(`Data row: [${new Date().toISOString()}, ${name}, ${phone}, ${date}, ${services.length} services, ${totalPrice}]`);
    console.log("====================================");

    // If integrating for real, we'd do:
    // 1. await sendEmail({ ... })
    // 2. await appendToSheet([ ... ])

    return NextResponse.json({ success: true, message: "Booking received" });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
