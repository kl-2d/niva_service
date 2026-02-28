import Services from "@/components/Services";
import EnginePricing from "@/components/EnginePricing";

export const metadata = {
  title: "Услуги и цены | НИВА СЕРВИС",
  description: "Полный каталог услуг и прайс-лист на ремонт автомобилей НИВА.",
};

export default function ServicesPage() {
  return (
    <div className="pt-8 pb-16">
      <Services />
      <EnginePricing />
    </div>
  );
}
