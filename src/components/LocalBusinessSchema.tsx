/**
 * JSON-LD Structured Data for LocalBusiness (AutoRepair)
 * Embed in any page with: <LocalBusinessSchema />
 */
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["AutoRepair", "LocalBusiness"],
    "@id": "https://niva-service.ru/#business",
    name: "Нива Сервис",
    alternateName: ["Niva Service", "НиваСервис"],
    description:
      "Специализированный автосервис в Воронеже по ремонту автомобилей Нива (ВАЗ-2121), Шевроле Нива и внедорожников. Ремонт ходовой, двигателя, КПП, раздатки, редукторов, выхлопной системы и тюнинг.",
    url: "https://niva-service.ru",
    logo: "https://niva-service.ru/logo.png",
    image: "https://niva-service.ru/og-image.jpg",
    telephone: ["+7-920-229-56-56", "+7-473-236-18-18"],
    email: "info@niva-service.ru",
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
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
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
      "Ремонт ходовой части",
      "Ремонт двигателя",
      "Ремонт КПП",
      "Ремонт раздаточной коробки",
      "Ремонт редукторов",
      "Ремонт внедорожников",
      "Тюнинг внедорожников",
    ],
    sameAs: [
      "https://yandex.ru/maps/-/CPqZM2Il",
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
