"use client";

import { useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#1B2636] border-t border-white/6 pt-14 pb-8 text-white" id="contacts">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand Info */}
            <div>
              {/* Logo row */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#1E63A8] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                  Нива Сервис
                </h2>
              </div>
              {/* Blue underline */}
              <div className="h-0.5 w-10 bg-[#1E63A8] rounded-full mb-4" />
              <p className="text-[#8A9DB5] text-sm leading-relaxed mb-4">
                Специализированный сервис по ремонту автомобилей семейства НИВА — ВАЗ-2121, Chevrolet Niva, Lada 4×4, Niva Travel. Принимаем и другие марки.
              </p>
              <div className="text-xs text-[#5A6475]">
                <p>ОГРН 304366434500094</p>
              </div>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-5">Контакты</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#8A9DB5]">
                  <div className="w-8 h-8 rounded-lg bg-[#1E63A8]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#7BB8E8]" />
                  </div>
                  <span className="text-sm leading-relaxed">г. Воронеж<br />ул. Матросова, 100</span>
                </li>
                <li className="flex flex-col gap-2">
                  <a href="tel:+79202295656" className="flex items-center gap-3 text-[#8A9DB5] hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-[#1E63A8]/20 flex items-center justify-center shrink-0 group-hover:bg-[#1E63A8]/35 transition-colors">
                      <Phone className="w-4 h-4 text-[#7BB8E8]" />
                    </div>
                    <span className="font-bold text-sm">+7 920 229-56-56</span>
                  </a>
                  <a href="tel:+74732361818" className="flex items-center gap-3 text-[#8A9DB5] hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center shrink-0">
                      {/* spacer */}
                    </div>
                    <span className="font-medium text-sm">+7 473 236-18-18</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Working Hours */}
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-5">Режим работы</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#8A9DB5]">
                  <div className="w-8 h-8 rounded-lg bg-[#1E63A8]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#7BB8E8]" />
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-[#D0DCE8] font-semibold">Пн-Пт: 9:00 — 18:00</p>
                    <p className="text-[#8A9DB5]">Сб: 10:00 — 16:00</p>
                    <p className="text-[#5A6475]">Вс: Выходной</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="h-48 lg:h-auto rounded-2xl overflow-hidden border border-white/8 relative bg-[#131D29] shadow-sm">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=39.154615%2C51.643812&z=16&pt=39.154615%2C51.643812,pm2rdm&mode=poi"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                className="absolute inset-0"
                title="Нива Сервис на карте"
              ></iframe>
            </div>
          </div>

          <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5A6475]">
            <p>© {new Date().getFullYear()} Нива Сервис. Все права защищены.</p>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-[#8A9DB5] transition-colors underline underline-offset-2"
            >
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
