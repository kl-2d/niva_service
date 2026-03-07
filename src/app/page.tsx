import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import ServicesPreview from "@/components/ServicesPreview";
import ProcessTimeline from "@/components/ProcessTimeline";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Нива Сервис — Специализированный ремонт Нивы (ВАЗ-2121, Chevrolet Niva, Lada 4×4) в Воронеже",
  description:
    "Специализированный автосервис семейства НИВА в Воронеже. Ремонт ВАЗ-2121, Chevrolet Niva, Lada 4×4, Niva Travel и других марок. Ходовая, двигатель, КПП, раздатка, редукторы, тюнинг. Ул. Матросова, 100. ☎ +7 920 229-56-56.",
  alternates: { canonical: "https://niva36.ru" },
  openGraph: {
    url: "https://niva36.ru",
    title: "Нива Сервис — Специализированный ремонт Нивы в Воронеже",
    description: "СТО семейства НИВА в Воронеже. Ремонт ВАЗ-2121, Chevrolet Niva, Lada 4×4, Niva Travel. 15+ лет опыта.",
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
      <FAQSection />
    </>
  );
}

