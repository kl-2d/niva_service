"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Settings, Car, Activity, Zap, Wind, PaintBucket, TrendingUp,
  CheckCircle2, Plus, Phone, ChevronRight, Search, X,
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

/* ── Price Table ────────────────────────────────────── */
function PriceTable({ slug }: { slug: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState("");
  const { addItem, items } = useCartStore();
  const searchRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    setFetchError(false);
    fetch(`/api/services?categorySlug=${slug}`)
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setSearch("");
    load();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() =>
    search.trim()
      ? services.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
      : services,
    [services, search]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-[3px] border-stone-200 border-t-[#E07B00] rounded-full animate-spin" />
        <p className="text-stone-500 text-base">Загружаем прайс-лист…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-2">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-stone-700 font-bold text-lg">Не удалось загрузить прайс-лист</p>
        <p className="text-stone-400 text-base">Проверьте подключение к интернету</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-base mt-2"
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-2">
          <Phone className="w-7 h-7 text-stone-400" />
        </div>
        <p className="text-stone-700 font-bold text-lg">Прайс-лист появится в ближайшее время</p>
        <p className="text-stone-400 text-base">Уточните стоимость работ по телефону</p>
        <a
          href="tel:+79202295656"
          className="inline-flex items-center gap-2 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-base mt-2"
        >
          <Phone className="w-5 h-5" />
          +7 (920) 229-56-56
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="px-6 py-4 border-b border-stone-100">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по услугам..."
            className="w-full pl-11 pr-10 py-3 bg-stone-50 border-2 border-stone-200 text-stone-800 rounded-xl text-base focus:outline-none focus:border-[#E07B00] focus:bg-white transition-all placeholder:text-stone-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-sm text-stone-400 mt-2 pl-1">
            Найдено: <span className="font-bold text-stone-600">{filtered.length}</span> из {services.length}
          </p>
        )}
      </div>

      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-stone-50 text-xs font-black text-[#1A2B4A] uppercase tracking-widest border-b border-stone-100">
        <span>Наименование услуги</span>
        <span className="text-right pr-4">Стоимость</span>
        <span className="w-32 text-center">Добавить</span>
      </div>

      {/* Service rows */}
      <div className="divide-y divide-stone-100">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16 gap-3 text-center"
            >
              <Search className="w-10 h-10 text-stone-200" />
              <p className="text-stone-500 text-base font-medium">По запросу «{search}» ничего не найдено</p>
              <button onClick={() => setSearch("")} className="text-[#E07B00] font-bold text-sm hover:underline">
                Сбросить поиск
              </button>
            </motion.div>
          ) : (
            filtered.map((item, idx) => {
              const isAdded = items.some((i) => i.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: idx * 0.035, duration: 0.28, ease: "easeOut" }}
                  className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-orange-50/50 hover:shadow-[inset_3px_0_0_#E07B00] transition-all duration-200 group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isAdded ? "text-[#E07B00]" : "text-stone-200 group-hover:text-[#E07B00]/40"}`} />
                    <span className="text-stone-800 font-medium text-base leading-snug">{item.title}</span>
                  </div>

                  <div className="flex items-center justify-between pl-8 md:pl-0 md:contents">
                    <span className="font-mono font-black text-stone-900 text-xl md:text-2xl md:text-right md:pr-4 whitespace-nowrap tabular-nums">
                      {item.price.toLocaleString("ru-RU")} <span className="text-stone-500 font-bold text-lg">₽</span>
                    </span>
                    <button
                      onClick={() => addItem(item)}
                      disabled={isAdded}
                      title={isAdded ? "Уже в заказе" : "Добавить в заказ"}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 md:w-32 border-2 ${isAdded
                        ? "bg-stone-50 text-stone-400 border-stone-200 cursor-default"
                        : "bg-white border-[#E07B00]/40 text-[#E07B00] hover:bg-[#E07B00] hover:text-white hover:border-[#E07B00] hover:shadow-md hover:shadow-orange-200 cursor-pointer transform hover:scale-105"
                        }`}
                    >
                      {isAdded ? (
                        <><CheckCircle2 className="w-4 h-4" /><span className="hidden md:inline">В заказе</span></>
                      ) : (
                        <><Plus className="w-4 h-4" /><span>В заказ</span></>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-stone-50 flex flex-wrap justify-between items-center gap-2 text-sm text-stone-400 border-t border-stone-100 rounded-b-2xl">
        <span className="font-medium">{services.length} позиций в разделе</span>
        <span className="text-xs">* Окончательная стоимость после диагностики</span>
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────── */
export default function ServicesSection() {
  const [activeSlug, setActiveSlug] = useState<string>(CATEGORIES[0].slug);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug)!;

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
    if (window.innerWidth < 1024) {
      setTimeout(() => mobilePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
    }
  };

  return (
    <section className="py-24 bg-[#F5F2EC]" id="services">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E07B00]/10 border border-[#E07B00]/25 text-[#E07B00] text-sm font-bold uppercase tracking-widest mb-5"
          >
            <Wrench className="w-3.5 h-3.5" />
            Прайс-лист
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tight"
          >
            Перечень ремонтных работ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 text-base md:text-lg max-w-xl mx-auto"
          >
            Выберите категорию — откроется прайс-лист с возможностью добавить услуги в заказ
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="h-1 bg-[#E07B00] mx-auto rounded-full mt-6"
          />
        </div>

        {/* ── Mobile: sticky tabs ── */}
        <div className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-[#F5F2EC]/95 backdrop-blur-md border-b border-stone-200/60 shadow-sm mb-4">
          <div ref={tabsScrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  ref={isActive ? activeTabRef : undefined}
                  onClick={() => handleSelect(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border-2 shrink-0 ${isActive
                    ? "bg-[#1A2B4A] text-white border-[#1A2B4A] shadow-lg"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#E07B00]/50"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E07B00]" : "text-[#E07B00]"}`} />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: sidebar + panel ── */}
        <div className="flex gap-6 items-start">

          {/* LEFT SIDEBAR — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col gap-1.5 w-64 xl:w-72 shrink-0 sticky top-24"
          >
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = activeSlug === cat.slug;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  onClick={() => handleSelect(cat.slug)}
                  className={`group flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 border-2 ${isActive
                    ? "bg-[#1A2B4A] border-[#1A2B4A] shadow-lg shadow-slate-900/20"
                    : "bg-white border-stone-200 hover:border-[#E07B00]/50 hover:shadow-md hover:bg-orange-50/30"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${isActive ? "bg-[#E07B00]" : "bg-stone-50 border border-stone-100 group-hover:bg-orange-100"
                    }`}>
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-[#E07B00]"}`} />
                  </div>
                  <span className={`font-bold text-base leading-tight transition-colors ${isActive ? "text-white" : "text-stone-800"
                    }`}>
                    {cat.title}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-5 h-5 text-[#E07B00] ml-auto shrink-0" />
                  )}
                </motion.button>
              );
            })}

            {/* Call CTA */}
            <div className="mt-4 rounded-2xl bg-[#1A2B4A] p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#E07B00] flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-stone-300 text-sm mb-4 leading-relaxed">
                Не нашли нужную услугу?<br />Звоните — подскажем!
              </p>
              <a
                href="tel:+79202295656"
                className="flex items-center justify-center gap-2 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold px-4 py-3 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-orange-900/25 w-full"
              >
                Позвонить
              </a>
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            ref={mobilePanelRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0 bg-white border-2 border-stone-200 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Panel header */}
            <div className="sticky top-[52px] lg:static z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b-2 border-stone-100 bg-gradient-to-r from-stone-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1A2B4A] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <activeCategory.icon className="w-6 h-6 text-[#E07B00]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 leading-tight">{activeCategory.title}</h3>
                  <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">{activeCategory.description}</p>
                </div>
              </div>
              <span className="text-sm text-stone-500 bg-stone-100 border border-stone-200 px-4 py-2 rounded-full self-start sm:self-auto whitespace-nowrap font-medium">
                Цены в рублях, за работу
              </span>
            </div>

            {/* Content — crossfade on slug change */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <PriceTable slug={activeSlug} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
