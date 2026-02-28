import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "НИВА СЕРВИС - Комплексный ремонт автомобилей НИВА",
  description: "Специализированный ремонт автомобилей НИВА и CHEVROLET NIVA в Воронеже.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} ${oswald.variable} antialiased flex flex-col min-h-screen bg-[#F5F2EC] text-[#1A1A1A]`}>
        <Navbar />
        <main className="flex-grow pt-[72px]">
          {children}
        </main>
        <Footer />
        <Cart />
      </body>
    </html>
  );
}
