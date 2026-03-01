import type { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Услуги и цены на ремонт Нивы в Воронеже | Нива Сервис",
  description:
    "Прайс-лист на ремонт Нивы (ВАЗ-2121) и Шевроле Нива в Воронеже. Ходовая, двигатель, КПП, раздатка, редукторы, выхлопная система, электрика, развал-схождение, тюнинг. Честные цены и высокое качество. Ул. Матросова, 100.",
  keywords: [
    "ремонт нивы цены",
    "прайс лист нива воронеж",
    "ремонт ходовой нива",
    "ремонт двигателя Нива",
    "ремонт КПП Нива",
    "раздатка Нива ремонт",
    "редуктор Нива ремонт",
    "тюнинг Нива воронеж",
    "развал схождение Нива",
    "выхлопная система Нива",
    "Цены на ремонт ВАЗ 2121",
  ],
  alternates: { canonical: "https://niva-service.ru/services" },
  openGraph: {
    url: "https://niva-service.ru/services",
    title: "Цены на ремонт Нивы в Воронеже",
    description: "Полный прайс-лист на ремонт Нивы (ВАЗ-2121), Шевроле Нива и внедорожников.",
  },
};

export default function ServicesPage() {
  return (
    <div className="pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://niva-service.ru" },
              { "@type": "ListItem", position: 2, name: "Услуги и цены", item: "https://niva-service.ru/services" },
            ],
          }),
        }}
      />
      <ServicesSection />
    </div>
  );
}

