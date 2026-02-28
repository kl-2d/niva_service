import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

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

    // --- Email Sending Logic ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const htmlContent = `
        <h2>Новая заявка на ремонт</h2>
        <b>Имя:</b> ${name}<br/>
        <b>Телефон:</b> ${phone}<br/>
        <b>Желаемая дата:</b> ${date || "Не указана"}<br/>
        <b>Выбранные услуги:</b>
        <ul>
          ${services.map((s: any) => `<li>${s.title} (${s.price} руб.)</li>`).join('')}
        </ul>
        <b>Итоговая сумма:</b> ${totalPrice} руб.
      `;

      await transporter.sendMail({
        from: \`"Нива Сервис" <\${process.env.SMTP_USER}>\`,
        to: process.env.MANAGER_EMAIL,
        subject: \`Новая заявка с сайта от: \${name}\`,
        html: htmlContent,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
    }

    // --- Google Sheets Integration ---
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

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
