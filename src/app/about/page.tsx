import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "О компании — Нива Сервис в Воронеже | Контакты, адрес",
  description:
    "Нива Сервис — специализированный автосервис в Воронеже. Более 15 лет ремонтируем Нивы (ВАЗ-2121), Шевроле Нива и внедорожники. Адрес: ул. Матросова, 100. Телефон: +7 920 229-56-56.",
  keywords: [
    "нива сервис воронеж",
    "о компании нива сервис",
    "автосервис нива воронеж адрес",
    "СТО нива матросова воронеж",
    "ремонт нивы воронеж контакты",
    "шевроле нива ремонт воронеж",
  ],
  alternates: { canonical: "https://niva-service.ru/about" },
  openGraph: {
    url: "https://niva-service.ru/about",
    title: "О компании — Нива Сервис Воронеж",
    description:
      "15+ лет специализируемся на ремонте Нивы и Шевроле Нива в Воронеже. Ул. Матросова, 100. ☎ +7 920 229-56-56.",
  },
};

export default function Page() {
  return <AboutPage />;
}
