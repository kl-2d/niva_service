"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Settings, Car, Activity, Zap, Wind, PaintBucket, TrendingUp,
  CheckCircle2, Plus, ChevronDown, Phone,
} from "lucide-react";
import { Service } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";

type CategoryDef = {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: React.ElementType;
};

const CATEGORIES: CategoryDef[] = [
  { id: 1, title: "Ремонт ходовой", description: "Диагностика и ремонт подвески, тормозов, рулевого управления.", slug: "hodovoy", icon: Car },
  { id: 2, title: "Ремонт двигателя", description: "Капитальный ремонт, замена ГРМ, поршневой группы.", slug: "engine", icon: Settings },
  { id: 3, title: "Ремонт КПП", description: "Устранение шумов, хрустов, выбивания передач. Усиление коробок.", slug: "kpp", icon: Wrench },
  { id: 4, title: "Ремонт раздатки", description: "Ремонт раздаточной коробки любой сложности.", slug: "razdatka", icon: Activity },
  { id: 5, title: "Редукторы", description: "Переборка редукторов переднего и заднего мостов.", slug: "reduktory", icon: TrendingUp },
  { id: 6, title: "Электрика", description: "Компьютерная диагностика ЭСУД, ремонт проводки.", slug: "electrics", icon: Zap },
  { id: 7, title: "Выхлоп", description: "Замена глушителей, резонаторов, катализаторов.", slug: "exhaust", icon: Wind },
  { id: 8, title: "Тюнинг", description: "Лифт-комплекты, силовые бампера, лебедки, грязевая резина.", slug: "tuning", icon: PaintBucket },
];

function PriceTable({ slug }: { slug: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services?categorySlug=${slug}`)
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 text-center text-stone-500">
        <div className="inline-block w-6 h-6 border-2 border-stone-300 border-t-[#E07B00] rounded-full animate-spin mb-3" />
        <p>Загружаем прайс-лист…</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-stone-500 mb-4">Подробный прайс-лист скоро появится.</p>
        <a
          href="tel:+7XXXXXXXXXX"
          className="inline-flex items-center gap-2 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Узнать цену по телефону
        </a>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
        <span>Услуга</span>
        <span className="text-right pr-4">Цена</span>
        <span className="w-24 text-center">В заказ</span>
      </div>

      {services.map((item, idx) => {
        const isAdded = items.some((i) => i.id === item.id);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.025 }}
            className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-stone-50 transition-colors group"
          >
            {/* Title */}
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-orange-200 group-hover:text-[#E07B00] transition-colors shrink-0" />
              <span className="text-stone-800 font-medium text-sm">{item.title}</span>
            </div>

            {/* Price + button row on mobile, separate cols on desktop */}
            <div className="flex items-center justify-between pl-7 md:pl-0 md:contents">
              <span className="font-mono font-bold text-stone-900 text-base md:text-right md:pr-4 whitespace-nowrap">
                {item.price.toLocaleString("ru-RU")} ₽
              </span>
              <button
                onClick={() => addItem(item)}
                disabled={isAdded}
                title={isAdded ? "Уже в заказе" : "Добавить в заказ"}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all md:w-24 ${
                  isAdded
                    ? "bg-emerald-100 text-[#E07B00] border border-emerald-200 cursor-default"
                    : "bg-orange-100 text-[#1A1A1A] border border-orange-300 hover:bg-orange-200 cursor-pointer"
                }`}
              >
                {isAdded ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /><span className="hidden md:inline">Добавлено</span></>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /><span>В заказ</span></>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}

      <div className="px-6 py-4 bg-stone-50 flex justify-between items-center text-sm text-stone-500">
        <span>{services.length} позиций</span>
        <span className="text-xs">* Окончательная стоимость после диагностики</span>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSelect = (slug: string) => {
    const next = activeSlug === slug ? null : slug;
    setActiveSlug(next);
    if (next) {
      setTimeout(() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug);

  return (
    <section className="py-24 bg-stone-100" id="services">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 uppercase tracking-tight"
          >
            Перечень ремонтных работ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-stone-600 text-lg"
          >
            Выберите раздел, чтобы открыть прайс-лист
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#2B3A2E] mx-auto rounded-full mt-5"
          />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = activeSlug === cat.slug;
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleSelect(cat.slug)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`text-left cursor-pointer rounded-xl p-5 border transition-all duration-200 flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B00] ${
                  isActive
                    ? "bg-[#2B3A2E] border-[#1a2a1e] shadow-lg -translate-y-0.5"
                    : "bg-white border-stone-200 hover:border-[#E07B00]/40 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  isActive
                    ? "bg-[#1a2a1e]"
                    : "bg-stone-50 border border-stone-100 group-hover:bg-orange-50"
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-[#E07B00]"}`} />
                </div>
                <h3 className={`font-bold text-base mb-1.5 transition-colors leading-snug ${
                  isActive ? "text-white" : "text-stone-900"
                }`}>
                  {cat.title}
                </h3>
                <p className={`text-xs leading-relaxed transition-colors ${
                  isActive ? "text-orange-200" : "text-stone-500"
                }`}>
                  {cat.description}
                </p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-semibold transition-colors ${
                  isActive ? "text-orange-300" : "text-[#E07B00]"
                }`}>
                  {isActive ? (
                    <>Скрыть прайс <ChevronDown className="w-3.5 h-3.5 rotate-180" /></>
                  ) : (
                    <>Открыть прайс <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Price table panel */}
        <div ref={tableRef}>
          <AnimatePresence mode="wait">
            {activeSlug && activeCategory && (
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden">
                  {/* Panel header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-stone-200 bg-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#2B3A2E] rounded-lg flex items-center justify-center shrink-0">
                        <activeCategory.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">{activeCategory.title}</h3>
                        <p className="text-xs text-stone-500">{activeCategory.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-full self-start sm:self-auto whitespace-nowrap">
                      Цены указаны за работу, в рублях
                    </span>
                  </div>

                  {/* Service rows */}
                  <PriceTable slug={activeSlug} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

