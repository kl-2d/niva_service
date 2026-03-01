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
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="self-center text-xl font-bold whitespace-nowrap text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
            Нива Сервис
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
          <div className="hidden lg:flex flex-col items-end gap-0.5 text-stone-300">
            <a href="tel:+79202295656" className="font-medium hover:text-[#E07B00] transition-colors flex items-center gap-1.5 text-sm">
              <Phone className="w-3.5 h-3.5 text-[#E07B00]" />
              +7 920 229-56-56
            </a>
            <a href="tel:+74732361818" className="text-stone-400 hover:text-[#E07B00] transition-colors text-xs pl-5">
              +7 473 236-18-18
            </a>
          </div>
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="text-white font-bold hover:bg-[#B86300] border border-transparent bg-[#E07B00] transition-colors focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-lg text-sm px-4 py-2 text-center shadow-sm"
          >
            Заказать звонок
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-stone-400 rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            isOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-white/10 rounded-lg bg-[#1C1C1C] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent w-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-3 rounded md:p-0 transition-colors ${
                      isActive
                        ? "text-[#E07B00] md:text-[#E07B00] font-semibold"
                        : "text-stone-300 hover:bg-white/5 md:hover:bg-transparent md:hover:text-[#E07B00]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li className="md:hidden mt-4 pt-4 border-t border-white/10">
              <a href="tel:+79202295656" className="flex items-center gap-2 py-2 px-3 text-white font-medium">
                <Phone className="w-4 h-4 text-[#E07B00]" />
                +7 920 229-56-56
              </a>
              <a href="tel:+74732361818" className="flex items-center gap-2 py-2 px-3 text-stone-300 font-medium text-sm">
                <Phone className="w-4 h-4 text-[#E07B00] opacity-0" />
                +7 473 236-18-18
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <RequestCallModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </>
  );
}

