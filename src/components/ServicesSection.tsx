"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Settings, Car, Activity, Zap, Wind, PaintBucket, TrendingUp,
  CheckCircle2, Plus, Phone, ChevronRight,
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
  { id: 7, title: "Выхлоп", description: "Замена глушителей, резонаторов, катализаторов.", slug: "vykhlopnaya", icon: Wind },
  { id: 8, title: "Тюнинг", description: "Лифт-комплекты, силовые бампера, лебедки, грязевая резина.", slug: "tuning", icon: PaintBucket },
  { id: 9, title: "Развал-схождение", description: "Регулировка углов установки колёс.", slug: "rasval", icon: TrendingUp },
];

/* ──────────────────────────────────────────
   Price table – stays mounted in the right panel,
   updates content on slug change only
────────────────────────────────────────── */
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-[#E07B00] rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Загружаем прайс-лист…</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-2">
          <Phone className="w-6 h-6 text-stone-400" />
        </div>
        <p className="text-stone-600 font-medium">Прайс-лист появится в ближайшее время</p>
        <p className="text-stone-400 text-sm">Уточните стоимость работ по телефону</p>
        <a
          href="tel:+79202295656"
          className="inline-flex items-center gap-2 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm mt-2"
        >
          <Phone className="w-4 h-4" />
          +7 (920) 229-56-56
        </a>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-stone-50 text-xs font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
        <span>Наименование услуги</span>
        <span className="text-right pr-4">Стоимость</span>
        <span className="w-28 text-center">Добавить</span>
      </div>

      {services.map((item, idx) => {
        const isAdded = items.some((i) => i.id === item.id);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3, ease: "easeOut" }}
            className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-stone-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${isAdded ? "text-[#E07B00]" : "text-stone-250 group-hover:text-[#E07B00]/50"}`} />
              <span className="text-stone-800 font-medium text-sm md:text-base leading-snug">{item.title}</span>
            </div>

            <div className="flex items-center justify-between pl-7 md:pl-0 md:contents">
              <span className="font-mono font-bold text-stone-900 text-base md:text-lg md:text-right md:pr-4 whitespace-nowrap">
                {item.price.toLocaleString("ru-RU")} ₽
              </span>
              <button
                onClick={() => addItem(item)}
                disabled={isAdded}
                title={isAdded ? "Уже в заказе" : "Добавить в заказ"}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all md:w-28 ${
                  isAdded
                    ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-default"
                    : "bg-orange-50 text-[#1A1A1A] border border-orange-200 hover:bg-[#E07B00] hover:text-white hover:border-[#E07B00] cursor-pointer"
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

      <div className="px-6 py-4 bg-stone-50 flex flex-wrap justify-between items-center gap-2 text-xs text-stone-400 border-t border-stone-100">
        <span>{services.length} позиций в разделе</span>
        <span>* Окончательная стоимость после диагностики</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Empty state shown inside the right panel
   when no category is selected
────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
        <Wrench className="w-7 h-7 text-stone-300" />
      </div>
      <p className="text-stone-400 text-base font-medium">Выберите раздел слева,<br />чтобы открыть прайс-лист</p>
      <div className="flex gap-1 items-center text-[#E07B00] text-sm font-semibold">
        <ChevronRight className="w-4 h-4 animate-pulse" />
        <span>Нажмите на категорию</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Main Section
────────────────────────────────────────── */
export default function ServicesSection() {
  // Default to first category so panel is never empty on first render
  const [activeSlug, setActiveSlug] = useState<string>(CATEGORIES[0].slug);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug)!;

  // Auto-scroll active tab into view in the horizontal tab bar
  useEffect(() => {
    if (activeTabRef.current && tabsScrollRef.current) {
      const container = tabsScrollRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (tabRect.left - containerRect.left) - 12;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeSlug]);

  const handleSelect = (slug: string) => {
    setActiveSlug(slug);
    // On mobile, scroll so the panel header is just below the sticky tabs
    if (window.innerWidth < 1024) {
      setTimeout(() => mobilePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
    }
  };

  return (
    <section className="py-24 bg-[#F5F2EC]" id="services">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4 uppercase tracking-tight"
          >
            Перечень ремонтных работ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-stone-500 text-base md:text-lg"
          >
            Выберите категорию, чтобы просмотреть прайс-лист
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#E07B00] mx-auto rounded-full mt-5"
          />
        </div>

        {/* ── Mobile: sticky scrollable tab bar ── */}
        <div className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-2.5 bg-[#F5F2EC] border-b border-stone-200/60 shadow-sm mb-4">
          <div ref={tabsScrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  ref={isActive ? activeTabRef : undefined}
                  onClick={() => handleSelect(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border shrink-0 ${
                    isActive
                      ? "bg-[#2B3A2E] text-white border-[#1a2a1e] shadow-md"
                      : "bg-white text-stone-600 border-stone-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-orange-300" : "text-[#E07B00]"}`} />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: sidebar + panel / Mobile: panel only ── */}
        <div className="flex gap-5 items-start">

          {/* LEFT SIDEBAR — desktop only */}
          <div className="hidden lg:flex flex-col gap-2 w-64 xl:w-72 shrink-0 sticky top-24">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.slug)}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border ${
                    isActive
                      ? "bg-[#2B3A2E] border-[#1a2a1e] shadow-lg"
                      : "bg-white border-stone-200 hover:border-[#E07B00]/40 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-[#1a2a1e]" : "bg-stone-50 border border-stone-100 group-hover:bg-orange-50"
                  }`}>
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-orange-300" : "text-[#E07B00]"}`} />
                  </div>
                  <span className={`font-semibold text-sm leading-tight transition-colors ${
                    isActive ? "text-white" : "text-stone-800"
                  }`}>
                    {cat.title}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-orange-300 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Call block at sidebar bottom */}
            <div className="mt-4 rounded-xl bg-[#2B3A2E] p-4 text-center">
              <p className="text-stone-300 text-xs mb-3 leading-relaxed">Не нашли нужную услугу? Звоните — подскажем!</p>
              <a
                href="tel:+79202295656"
                className="inline-flex items-center gap-2 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
            </div>
          </div>

          {/* RIGHT PANEL — price table, stable height */}
          <div
            ref={mobilePanelRef}
            className="flex-1 min-w-0 bg-white border border-[#D4CFC8] rounded-2xl shadow-lg"
          >
            {/* Panel header — sticky on mobile so category title stays visible while scrolling */}
            <div className="sticky top-[52px] lg:static z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-stone-100 bg-stone-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2B3A2E] rounded-lg flex items-center justify-center shrink-0">
                  <activeCategory.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 leading-tight">{activeCategory.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{activeCategory.description}</p>
                </div>
              </div>
              <span className="text-xs text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-full self-start sm:self-auto whitespace-nowrap">
                Цены в рублях, за работу
              </span>
            </div>

            {/* Content area — crossfade on slug change, no height jump */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <PriceTable slug={activeSlug} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
