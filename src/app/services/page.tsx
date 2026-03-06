import type { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Услуги и цены на ремонт Нивы в Воронеже | Нива Сервис",
  description:
    "Прайс-лист на ремонт Нивы (ВАЗ-2121) и Шевроле Нива в Воронеже. Подвеска, рулевое, карданная передача, сцепление, КПП, раздатка, мосты, тормоза, охлаждение, выпуск, двигатель, электрооборудование, кузов, модернизация. Честные цены. Ул. Матросова, 100.",
  keywords: [
    "ремонт нивы цены",
    "прайс лист нива воронеж",
    "ремонт подвески нива",
    "ремонт двигателя нива",
    "ремонт КПП нива",
    "раздатка нива ремонт",
    "передний мост нива",
    "задний мост нива",
    "тормозная система нива",
    "система охлаждения нива",
    "электрооборудование нива",
    "модернизация нива воронеж",
    "цены на ремонт ВАЗ 2121",
    "рулевое управление нива",
    "карданная передача нива",
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

