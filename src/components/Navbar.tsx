"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import RequestCallModal from "./RequestCallModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const openModal = () => setIsRequestModalOpen(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const navLinks = [
    { name: "Главная", href: "/" },
    { name: "Услуги и цены", href: "/services" },
    { name: "О нас", href: "/about" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled
          ? "bg-[#1B2636]/98 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/6"
          : "bg-[#1B2636]/95 backdrop-blur-md border-b border-white/6"
          }`}
      >
        {/* Top blue accent line */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#1B2636] via-[#1E63A8] to-[#1B2636]" />

        <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-300`}
          style={{ height: scrolled ? "60px" : "72px" }}
        >

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-[#1E63A8] flex items-center justify-center shadow-md shadow-[#1E63A8]/30 shrink-0 group-hover:bg-[#175495] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-xl font-black text-white uppercase tracking-wider transition-colors group-hover:text-[#7BB8E8]"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Нива Сервис
              </span>
              <span className="text-[10px] text-[#7BB8E8]/70 font-bold tracking-[0.3em] uppercase hidden sm:block mt-0.5">
                Воронеж
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2.5 text-base font-semibold tracking-wide transition-colors duration-200 group ${isActive
                      ? "text-[#7BB8E8]"
                      : "text-[#D0DCE8] hover:text-white"
                      }`}
                  >
                    {link.name}
                    {/* Slide underline */}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full transition-all duration-300 ${isActive
                        ? "bg-[#7BB8E8] scale-x-100"
                        : "bg-[#7BB8E8] scale-x-0 group-hover:scale-x-100"
                        }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right group */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Phone — desktop only */}
            <a
              href="tel:+79202295656"
              className="hidden lg:flex items-center gap-2.5 text-sm font-medium text-[#D0DCE8] hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/8 group border border-transparent hover:border-white/10"
            >
              <span className="w-8 h-8 rounded-lg bg-[#1E63A8]/25 flex items-center justify-center shrink-0 group-hover:bg-[#1E63A8]/40 transition-colors">
                <Phone className="w-4 h-4 text-[#7BB8E8]" />
              </span>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-bold text-[15px] text-white">+7 920 229-56-56</span>
                <span className="text-[10px] text-[#8A9DB5] font-medium">Звонок бесплатный</span>
              </div>
            </a>

            {/* Phone icon — mobile/tablet only */}
            <a
              href="tel:+79202295656"
              className="lg:hidden w-9 h-9 rounded-xl bg-[#1E63A8]/25 flex items-center justify-center text-[#7BB8E8] hover:bg-[#1E63A8]/40 transition-colors border border-[#1E63A8]/20"
              aria-label="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* CTA button */}
            <button
              type="button"
              onClick={openModal}
              className="hidden sm:flex items-center gap-1.5 text-white font-bold bg-[#1E63A8] hover:bg-[#175495] transition-all rounded-xl text-sm px-5 py-2.5 shadow-btn hover:-translate-y-px shrink-0"
            >
              Заказать звонок
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-xl text-[#D0DCE8] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="px-4 pb-5 pt-2 border-t border-white/8 bg-[#131D29] space-y-1">

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-semibold transition-all duration-200 ${isActive
                    ? "text-[#7BB8E8] bg-[#1E63A8]/15 border border-[#1E63A8]/25"
                    : "text-[#D0DCE8] hover:text-white hover:bg-white/8"
                    }`}
                >
                  {link.name}
                  <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? "text-[#7BB8E8]" : "text-[#8A9DB5]"}`} />
                </Link>
              );
            })}

            {/* Mobile contact block */}
            <div className="pt-3 mt-2 border-t border-white/8 grid grid-cols-2 gap-2">
              <a
                href="tel:+79202295656"
                className="flex flex-col items-center gap-1 py-3 px-3 rounded-xl bg-[#1E63A8]/15 border border-[#1E63A8]/25 hover:bg-[#1E63A8]/25 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#7BB8E8]" />
                <span className="text-white text-xs font-bold">+7 920 229-56-56</span>
                <span className="text-[#8A9DB5] text-[10px]">Основной</span>
              </a>
              <a
                href="tel:+74732361818"
                className="flex flex-col items-center gap-1 py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#8A9DB5]" />
                <span className="text-white text-xs font-bold">+7 473 236-18-18</span>
                <span className="text-[#8A9DB5] text-[10px]">Стационарный</span>
              </a>
            </div>

            <button
              onClick={() => { setIsRequestModalOpen(true); setIsOpen(false); }}
              className="w-full mt-1 text-white font-bold bg-[#1E63A8] hover:bg-[#175495] transition-colors rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 shadow-btn"
            >
              Заказать обратный звонок
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <RequestCallModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </>
  );
}
