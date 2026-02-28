import { NextResponse } from "next/server";
import { google } from "googleapis";

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

    // --- Google Sheets Integration ---
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Format services into a single string, including desired date if provided
    let formattedServicesString = services.map((s: any) => s.title).join(', ');
    if (date) {
      formattedServicesString += ` | Желаемая дата: ${date}`;
    }

    // Append to sheet
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }), 
            name, 
            phone, 
            formattedServicesString, 
            totalPrice
          ]
        ]
      }
    });

    return NextResponse.json({ success: true, message: "Booking received" });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
