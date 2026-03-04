"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronRight, Zap } from "lucide-react";
import RequestCallModal from "./RequestCallModal";

interface PromoData {
  title: string;
  effectiveActive: boolean;
  eventDateStart: string | null;
  eventDate: string | null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [promoSource, setPromoSource] = useState<string | undefined>();
  const [scrolled, setScrolled] = useState(false);
  const [promo, setPromo] = useState<PromoData | null>(null);

  const openModal = (fromPromo?: string) => {
    setPromoSource(fromPromo);
    setIsRequestModalOpen(true);
  };
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Загружаем акцию
  useEffect(() => {
    fetch("/api/promo")
      .then((r) => r.json())
      .then((data: PromoData) => {
        if (data?.effectiveActive) setPromo(data);
      })
      .catch(() => { });
  }, []);

  const navLinks = [
    { name: "Главная", href: "/" },
    { name: "Услуги и цены", href: "/services" },
    { name: "О нас", href: "/about" },
  ];

  // Форматируем диапазон дат
  const promoDateRange = promo
    ? (() => {
      const fmt = (d: string) =>
        new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      if (promo.eventDateStart && promo.eventDate)
        return `${fmt(promo.eventDateStart)} — ${fmt(promo.eventDate)}`;
      if (promo.eventDate)
        return `до ${fmt(promo.eventDate)}`;
      if (promo.eventDateStart)
        return `с ${fmt(promo.eventDateStart)}`;
      return null;
    })()
    : null;

  return (
    <>
      <nav
        className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled
          ? "bg-[#1A1A1A]/98 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5"
          : "bg-[#1C1C1C]/95 backdrop-blur-md border-b border-white/10"
          }`}
      >
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#E07B00] flex items-center justify-center shadow-sm shadow-orange-900/40 shrink-0 group-hover:bg-[#B86300] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-xl font-bold text-white uppercase tracking-wider transition-colors group-hover:text-[#E07B00]"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Нива Сервис
              </span>
              <span className="text-[11px] text-stone-400 font-medium tracking-widest uppercase hidden sm:block">
                Воронеж
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2.5 rounded-lg text-base font-semibold tracking-wide transition-all duration-200 ${isActive
                      ? "text-[#E07B00] bg-white/8"
                      : "text-stone-300 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-4 right-4 h-[2px] bg-[#E07B00] rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Промо-плашка в навигации (только если акция активна) */}
            {promo && (
              <li>
                <button
                  onClick={() => openModal(promo.title)}
                  className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E07B00]/15 border border-[#E07B00]/30 text-[#E07B00] hover:bg-[#E07B00]/25 transition-all text-sm font-bold group"
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E07B00]" />
                  </span>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{promo.title}</span>
                  {promoDateRange && (
                    <span className="text-stone-400 font-normal text-xs hidden lg:inline">
                      ({promoDateRange})
                    </span>
                  )}
                </button>
              </li>
            )}
          </ul>

          {/* Right group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone — desktop only */}
            <a
              href="tel:+79202295656"
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-stone-200 hover:text-[#E07B00] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8 group"
            >
              <span className="w-7 h-7 rounded-full bg-[#E07B00]/15 flex items-center justify-center shrink-0 group-hover:bg-[#E07B00]/25 transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#E07B00]" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base">+7 920 229-56-56</span>
                <span className="text-[10px] text-stone-500">Звонок бесплатный</span>
              </div>
            </a>

            {/* Phone icon — mobile/tablet only */}
            <a
              href="tel:+79202295656"
              className="lg:hidden w-9 h-9 rounded-xl bg-[#E07B00]/15 flex items-center justify-center text-[#E07B00] hover:bg-[#E07B00]/25 transition-colors"
              aria-label="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* CTA button */}
            <button
              type="button"
              onClick={() => openModal()}
              className="hidden sm:flex items-center gap-1.5 text-white font-bold bg-[#E07B00] hover:bg-[#B86300] transition-colors rounded-xl text-sm px-4 py-2 shadow-sm shadow-orange-900/20 shrink-0"
            >
              Заказать звонок
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="px-4 pb-5 pt-2 border-t border-white/8 bg-[#181818] space-y-1">

            {/* Промо-плашка в мобильном меню */}
            {promo && (
              <button
                onClick={() => { openModal(promo.title); setIsOpen(false); }}
                className="w-full flex items-center gap-2 py-3 px-4 rounded-xl bg-[#E07B00]/10 border border-[#E07B00]/20 text-[#E07B00] font-bold text-sm mb-1"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{promo.title}</span>
                {promoDateRange && <span className="text-xs text-stone-400 font-normal">{promoDateRange}</span>}
              </button>
            )}

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-semibold transition-all duration-200 ${isActive
                    ? "text-[#E07B00] bg-[#E07B00]/10 border border-[#E07B00]/20"
                    : "text-stone-300 hover:text-white hover:bg-white/8"
                    }`}
                >
                  {link.name}
                  <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? "text-[#E07B00]" : "text-stone-600"}`} />
                </Link>
              );
            })}

            {/* Mobile contact block */}
            <div className="pt-3 mt-2 border-t border-white/8 grid grid-cols-2 gap-2">
              <a
                href="tel:+79202295656"
                className="flex flex-col items-center gap-1 py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E07B00]" />
                <span className="text-white text-xs font-bold">+7 920 229-56-56</span>
                <span className="text-stone-500 text-[10px]">Основной</span>
              </a>
              <a
                href="tel:+74732361818"
                className="flex flex-col items-center gap-1 py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-stone-400" />
                <span className="text-white text-xs font-bold">+7 473 236-18-18</span>
                <span className="text-stone-500 text-[10px]">Стационарный</span>
              </a>
            </div>
            <button
              onClick={() => { setIsRequestModalOpen(true); setIsOpen(false); }}
              className="w-full mt-1 text-white font-bold bg-[#E07B00] hover:bg-[#B86300] transition-colors rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-900/20"
            >
              Заказать обратный звонок
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
      <RequestCallModal
        isOpen={isRequestModalOpen}
        onClose={() => { setIsRequestModalOpen(false); setPromoSource(undefined); }}
        promoSource={promoSource}
      />
    </>
  );
}
