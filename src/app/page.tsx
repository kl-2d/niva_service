import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import ServicesPreview from "@/components/ServicesPreview";
import ProcessTimeline from "@/components/ProcessTimeline";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Нива Сервис — Ремонт Нивы и Шевроле Нива в Воронеже | Главная",
  description:
    "Единственный специализированный автосервис Нива в Воронеже. Ремонт ВАЗ-2121, Шевроле Нива, внедорожников. Ходовая, двигатель, КПП, раздатка, редукторы, тюнинг. Ул. Матросова, 100. ☎ +7 920 229-56-56.",
  alternates: {
    canonical: "https://niva-service.ru",
  },
  openGraph: {
    url: "https://niva-service.ru",
    title: "Нива Сервис — Ремонт Нивы в Воронеже",
    description:
      "Специализированный СТО в Воронеже. Ремонт Нивы (ВАЗ-2121), Шевроле Нива и внедорожников. 15+ лет опыта.",
  },
};

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <Hero />
      <Statistics />
      <ServicesPreview />
      <ProcessTimeline />
    </>
  );
}
