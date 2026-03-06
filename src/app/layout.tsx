import type { Metadata } from "next";
import { Roboto, Oswald, Roboto_Mono } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://niva-service.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Нива Сервис — Ремонт Нивы и Шевроле Нива в Воронеже",
    template: "%s | Нива Сервис Воронеж",
  },
  description:
    "Специализированный автосервис в Воронеже. Ремонт Нивы (ВАЗ-2121), Шевроле Нива и внедорожников. Ходовая, двигатель, КПП, раздатка, редукторы, тюнинг. Более 15 лет опыта. Ул. Матросова, 100.",
  keywords: [
    "ремонт нивы воронеж",
    "сервис нива воронеж",
    "ремонт шевроле нива",
    "ВАЗ 2121 воронеж",
    "нива 4x4 ремонт",
    "ремонт внедорожников воронеж",
    "ремонт ходовой нива",
    "ремонт двигателя нива",
    "ремонт КПП нива",
    "ремонт раздатки нива",
    "редуктор нива ремонт",
    "тюнинг нива воронеж",
    "нива сервис",
    "автосервис воронеж нива",
    "СТО нива воронеж",
    "матросова 100 воронеж",
  ],
  authors: [{ name: "Нива Сервис", url: SITE_URL }],
  creator: "Нива Сервис",
  publisher: "Нива Сервис",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Нива Сервис",
    title: "Нива Сервис — Ремонт Нивы и Шевроле Нива в Воронеже",
    description:
      "Специализированный автосервис в Воронеже. Ремонт Нивы (ВАЗ-2121), Шевроле Нива и внедорожников. 15+ лет опыта. Ул. Матросова, 100.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Нива Сервис — специализированный автосервис в Воронеже",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Нива Сервис — Ремонт Нивы в Воронеже",
    description: "Специализированный сервис Нива и Шевроле Нива. Ул. Матросова, 100, Воронеж.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Добавьте свои коды верификации когда будут готовы:
    // google: "ваш-код-google-search-console",
    // yandex: "ваш-код-яндекс-вебмастер",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <meta name="geo.region" content="RU-VOR" />
        <meta name="geo.placename" content="Воронеж" />
        <meta name="geo.position" content="51.643812;39.154615" />
        <meta name="ICBM" content="51.643812, 39.154615" />
      </head>
      <body
        className={`${roboto.variable} ${oswald.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen bg-[var(--col-bg)] text-[var(--col-text)]`}
      >
        {!isAdmin && <Navbar />}
        <main className={`flex-grow${!isAdmin ? " pt-[64px]" : ""}`}>
          {children}
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <Cart />}
      </body>
    </html>
  );
}
