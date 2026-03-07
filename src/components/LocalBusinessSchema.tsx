/**
 * JSON-LD Structured Data for LocalBusiness (AutoRepair)
 * Embed in any page with: <LocalBusinessSchema />
 */
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["AutoRepair", "LocalBusiness"],
    "@id": "https://niva36.ru/#business",
    name: "Нива Сервис",
    alternateName: ["Niva Service", "НиваСервис"],
    description:
      "Специализированный автосервис в Воронеже по ремонту автомобилей Нива (ВАЗ-2121), Шевроле Нива и внедорожников. Ремонт ходовой, двигателя, КПП, раздатки, редукторов, выхлопной системы и тюнинг.",
    slogan: "Единственный специализированный сервис Воронежа по семейству НИВА",
    url: "https://niva36.ru",
    logo: "https://niva36.ru/og-image.jpg",
    image: "https://niva36.ru/og-image.jpg",
    telephone: ["+7-920-229-56-56", "+7-473-236-18-18"],
    email: "niva36@mail.ru",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Матросова, 100",
      addressLocality: "Воронеж",
      addressRegion: "Воронежская область",
      postalCode: "394000",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.643812,
      longitude: 39.154615,
    },
    hasMap: "https://yandex.ru/maps/-/CPqZM2Il",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
    ],
    priceRange: "₽₽",
    currenciesAccepted: "RUB",
    paymentAccepted: "Cash, Credit Card",
    areaServed: {
      "@type": "City",
      name: "Воронеж",
    },
    knowsAbout: [
      "Ремонт Нивы",
      "Ремонт ВАЗ-2121",
      "Ремонт Шевроле Нива",
      "Ремонт Lada 4×4",
      "Ремонт Niva Travel",
      "Ремонт ходовой части",
      "Ремонт двигателя",
      "Ремонт КПП",
      "Ремонт раздаточной коробки",
      "Ремонт редукторов",
      "Ремонт внедорожников",
      "Тюнинг внедорожников",
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт ходовой части", description: "Подвеска, тормоза, рулевое управление" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт двигателя", description: "Капремонт, ГРМ, поршневая группа" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт КПП", description: "Шумы, хрусты, выбивание передач" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт раздаточной коробки", description: "Раздатка любой сложности" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт редукторов и мостов", description: "Переборка мостов, установка самоблоков" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Электрика и диагностика", description: "Диагностика ЭСУД, ремонт проводки" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Выхлопная система", description: "Глушители, резонаторы, катализаторы" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Тюнинг и модернизация", description: "Лифт-комплекты, лебёдки, грязевая резина" } },
    ],
    sameAs: [
      "https://yandex.ru/maps/-/CPqZM2Il",
      "mailto:niva36@mail.ru",
    ],
    foundingDate: "2008",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 5,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
