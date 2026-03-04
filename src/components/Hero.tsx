"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return `с ${fmt(start)}`;
  if (end) return `до ${fmt(end)}`;
  return "";
}

export default function Hero() {
  const [promo, setPromo] = useState<PromoData | null>(null);

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-16 pb-24 text-center">
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
            className="text-lg md:text-2xl text-stone-300 mb-10 max-w-2xl mx-auto font-light"
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
              <Link
                href="/services"
                className="group block w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[#E07B00]/40 hover:border-[#E07B00] transition-all duration-300 hover:shadow-[0_0_40px_rgba(224,123,0,0.25)]"
                style={{ background: "rgba(224,123,0,0.12)", backdropFilter: "blur(12px)" }}
              >
                {/* Верхняя строка — iконка + метка */}
                <div className="flex items-center gap-3 px-6 pt-5 pb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#E07B00] shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </span>
                  <span className="text-sm font-bold text-[#E07B00] uppercase tracking-widest">
                    Акция
                  </span>
                  <span className="ml-auto flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#E07B00] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E07B00]" />
                  </span>
                </div>

                {/* Название */}
                <div className="px-6 pb-2">
                  <p className="text-xl md:text-2xl font-black text-white leading-snug">
                    {promo.title}
                  </p>
                </div>

                {/* Описание */}
                {promo.description && (
                  <div className="px-6 pb-3">
                    <p className="text-base text-stone-300 leading-snug">
                      {promo.description}
                    </p>
                  </div>
                )}

                {/* Период */}
                {dateRange && (
                  <div className="px-6 pb-5 flex items-center gap-2 text-sm text-stone-400">
                    <Calendar className="w-4 h-4 text-[#E07B00] shrink-0" />
                    <span>{dateRange}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[#E07B00] group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Link>
            ) : (
              /* ── Кнопки (если акции нет) ── */
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#services-preview"
                  className="w-full sm:w-auto px-8 py-4 bg-[#E07B00] hover:bg-[#B86300] text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-900/30 flex items-center justify-center gap-2"
                >
                  Направления ремонта
                  <ChevronRight className="w-5 h-5" />
                </a>
                <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-lg transition-colors border border-white/30 backdrop-blur-sm">
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
  );
}
