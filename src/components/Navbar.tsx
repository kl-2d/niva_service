"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import RequestCallModal from "./RequestCallModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Главная", href: "/" },
    { name: "Услуги и цены", href: "/services" },
    { name: "О нас", href: "/about" },
  ];

  return (
    <>
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-[#1C1C1C]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="text-xl font-bold whitespace-nowrap text-white uppercase tracking-wider transition-colors hover:text-[#E07B00]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Нива Сервис
          </span>
        </Link>

        {/* Desktop nav links — centered */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`relative text-base font-semibold tracking-wide transition-colors duration-200 group ${
                    isActive ? "text-[#E07B00]" : "text-stone-200 hover:text-white"
                  }`}
                >
                  {link.name}
                  {/* animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#E07B00] rounded-full transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: phones + CTA + hamburger */}
        <div className="flex items-center gap-4">
          {/* Phones — lg+ */}
          <div className="hidden lg:flex flex-col items-end leading-tight">
            <a href="tel:+79202295656" className="flex items-center gap-1.5 text-sm font-medium text-stone-200 hover:text-[#E07B00] transition-colors duration-200">
              <Phone className="w-3.5 h-3.5 text-[#E07B00] shrink-0" />
              +7 920 229-56-56
            </a>
            <a href="tel:+74732361818" className="text-xs text-stone-400 hover:text-[#E07B00] transition-colors duration-200 pl-5">
              +7 473 236-18-18
            </a>
          </div>

          {/* CTA button */}
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="hidden sm:block text-white font-bold bg-[#E07B00] hover:bg-[#B86300] transition-colors duration-200 rounded-lg text-sm px-5 py-2.5 shadow-sm shrink-0"
          >
            Заказать звонок
          </button>

          {/* Hamburger — mobile */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-stone-400 hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-2 border-t border-white/10 bg-[#1C1C1C] space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-3 px-3 rounded-lg text-base font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-[#E07B00] bg-white/5"
                    : "text-stone-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
            <a href="tel:+79202295656" className="flex items-center gap-2 py-2 px-3 text-white font-medium">
              <Phone className="w-4 h-4 text-[#E07B00]" />
              +7 920 229-56-56
            </a>
            <a href="tel:+74732361818" className="flex items-center gap-2 py-2 px-3 text-stone-400 text-sm">
              <Phone className="w-4 h-4 opacity-0" />
              +7 473 236-18-18
            </a>
            <button
              onClick={() => { setIsRequestModalOpen(true); setIsOpen(false); }}
              className="w-full mt-1 text-white font-bold bg-[#E07B00] hover:bg-[#B86300] transition-colors rounded-lg py-3 text-sm"
            >
              Заказать звонок
            </button>
          </div>
        </div>
      </div>
    </nav>
    <RequestCallModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </>
  );
}
