import ServicesSection from "@/components/ServicesSection";

export const metadata = {
  title: "Услуги и цены | НИВА СЕРВИС",
  description: "Полный каталог услуг и прайс-лист на ремонт автомобилей НИВА.",
};

export default function ServicesPage() {
  return (
    <div className="pt-8 pb-16">
      <ServicesSection />
    </div>
  );
}

