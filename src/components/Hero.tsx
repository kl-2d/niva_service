"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequestCallModal from "./RequestCallModal";

interface PromoData {
  title: string;
  description: string;
  isActive: boolean;
  eventDateStart: string | null;
  eventDate: string | null;
}

function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  if (start && end) return `с ${fmt(start)} — по ${fmt(end)}`;
  if (start) return `с ${fmt(start)}`;
  if (end) return `до ${fmt(end)}`;
  return "";
}

export default function Hero() {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/promo")
      .then((r) => r.json())
      .then((data) => {
        if (!data || !data.isActive) return;
        const today = new Date().toISOString().slice(0, 10);
        const expired = data.eventDate && today > data.eventDate;
        const notStarted = data.eventDateStart && today < data.eventDateStart;
        if (!expired && !notStarted) setPromo(data);
      })
      .catch(() => { });
  }, []);

  const dateRange = promo ? formatDateRange(promo.eventDateStart, promo.eventDate) : "";

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
            backgroundColor: "#1C1C1C",
          }}
        >
          <div className="absolute inset-0 bg-[#1C1C1C]/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-stone-300 bg-white/10 border border-white/20 rounded-full shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07B00]"></span>
              </span>
              Работаем для вас с 2008 года
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-tight leading-tight"
            >
              Специализированный ремонт автомобилей семейства <span className="text-[#E07B00]">НИВА</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-xl text-stone-300 mb-8 max-w-2xl mx-auto font-light"
            >
              Единственный специализированный сервис Воронежа по семейству НИВА (ВАЗ-2121, Chevrolet Niva, Lada 4×4, Niva Travel). Ремонтируем и другие марки автомобилей.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {promo ? (
                /* ── Плашка акции ── */
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(true)}
                  className="group block w-full max-w-2xl mx-auto text-left"
                >
                  <div
                    className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-5 py-6 sm:px-7 sm:py-6 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#E07B00]/50 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(224,123,0,0.18)] group-hover:-translate-y-0.5"
                    style={{ background: "rgba(10,20,40,0.78)", backdropFilter: "blur(18px)" }}
                  >
                    {/* Orange left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E07B00] rounded-l-2xl" />

                    {/* Icon + pill */}
                    <div className="flex items-center gap-3 shrink-0 pl-2">
                      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E07B00] shadow-lg shadow-[#E07B00]/40 shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <Zap className="w-7 h-7 text-white" />
                        {/* Pulse dot */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B00] opacity-70" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E07B00] border-2 border-[#0A1428]" />
                        </span>
                      </div>
                      <span className="sm:hidden text-xs font-black text-[#E07B00] uppercase tracking-[0.18em]">
                        Акция
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pl-2 sm:pl-0">
                      {/* АКЦИЯ pill — desktop only */}
                      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07B00] text-white text-xs font-black uppercase tracking-widest mb-3 shadow-md shadow-[#E07B00]/30">
                        <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse" />
                        Акция в данный момент
                      </div>

                      {/* Title */}
                      <p className="text-2xl sm:text-4xl font-black text-[#E07B00] leading-tight drop-shadow-sm">
                        {promo.title}
                      </p>

                      {/* Description */}
                      {promo.description && (
                        <p className="text-sm sm:text-lg text-stone-200 leading-snug mt-2">
                          {promo.description}
                        </p>
                      )}

                      {/* Date */}
                      {dateRange && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-xs text-stone-400 font-medium">
                            <Calendar className="w-3 h-3 text-[#E07B00] shrink-0" />
                            Акция действует {dateRange}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Arrow CTA */}
                    <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#E07B00] shrink-0 pr-1 group-hover:gap-3 transition-all duration-300">
                      Подробнее
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>

              ) : (
                /* ── Кнопки (если акции нет) ── */
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
                  <a
                    href="#services-preview"
                    className="px-8 py-4 bg-[#E07B00] hover:bg-[#B86300] text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-900/30 flex items-center justify-center gap-2"
                  >
                    Направления ремонта
                    <ChevronRight className="w-5 h-5" />
                  </a>
                  <Link href="/services" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-lg transition-colors border border-white/30 backdrop-blur-sm flex items-center justify-center">
                    Услуги и цены
                  </Link>
                </div>
              )}
            </motion.div>

          </motion.div>
        </div>

        {/* Gradient fade to page bg */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#F5F2EC] to-transparent z-10"></div>
      </section>

      {/* Promo Call Modal */}
      <RequestCallModal
        isOpen={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        promoSource={promo?.title}
      />
    </>
  );
}
