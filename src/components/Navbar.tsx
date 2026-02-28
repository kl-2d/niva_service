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
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="self-center text-xl font-bold whitespace-nowrap text-white uppercase tracking-wider">
            Нива Сервис
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
          <div className="hidden lg:flex items-center gap-2 text-zinc-300">
            <Phone className="w-4 h-4 text-orange-500" />
            <a href="tel:+79202295656" className="font-medium hover:text-white transition-colors">
              +7 920 229-56-56
            </a>
          </div>
          <button
            type="button"
            className="text-white hover:bg-orange-600 border border-orange-500 bg-orange-500/10 transition-colors focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Заказать звонок
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-zinc-400 rounded-lg md:hidden hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600"
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
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-zinc-800 rounded-lg bg-zinc-900 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent w-full">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 text-zinc-300 rounded hover:bg-zinc-800 md:hover:bg-transparent md:hover:text-orange-500 md:p-0 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="md:hidden mt-4 pt-4 border-t border-zinc-800">
              <a href="tel:+79202295656" className="flex items-center gap-2 py-2 px-3 text-white font-medium">
                <Phone className="w-4 h-4 text-orange-500" />
                +7 920 229-56-56
              </a>
              <a href="tel:+74732361818" className="flex items-center gap-2 py-2 px-3 text-zinc-400 font-medium text-sm">
                <Phone className="w-4 h-4 text-orange-500" />
                +7 473 236-18-18
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
