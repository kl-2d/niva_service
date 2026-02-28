"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Услуги", href: "#services" },
    { name: "Преимущества", href: "#benefits" },
    { name: "Отзывы", href: "#reviews" },
    { name: "Контакты", href: "#contacts" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="self-center text-xl font-bold whitespace-nowrap text-slate-800 uppercase tracking-wider">
            Нива Сервис
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
          <div className="hidden lg:flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-blue-600" />
            <a href="tel:+79202295656" className="font-medium hover:text-blue-600 transition-colors">
              +7 920 229-56-56
            </a>
          </div>
          <button
            type="button"
            className="text-white hover:bg-blue-700 border border-transparent bg-blue-600 transition-colors focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center shadow-sm"
          >
            Заказать звонок
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-slate-200 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent w-full">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 text-slate-600 rounded hover:bg-slate-50 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="md:hidden mt-4 pt-4 border-t border-slate-200">
              <a href="tel:+79202295656" className="flex items-center gap-2 py-2 px-3 text-slate-800 font-medium">
                <Phone className="w-4 h-4 text-blue-600" />
                +7 920 229-56-56
              </a>
              <a href="tel:+74732361818" className="flex items-center gap-2 py-2 px-3 text-slate-600 font-medium text-sm">
                <Phone className="w-4 h-4 text-blue-600" />
                +7 473 236-18-18
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
