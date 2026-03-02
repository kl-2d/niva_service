"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import RequestCallModal from "./RequestCallModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
          backgroundColor: "#1C1C1C", // Fallback if image not yet loaded
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
            Комплексный ремонт автомобилей <span className="text-[#E07B00]">НИВА</span> и CHEVROLET NIVA
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-2xl text-stone-300 mb-10 max-w-2xl mx-auto font-light"
          >
            В единственном специализированном сервисе Воронежа. Качество, проверенное временем.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#E07B00] hover:bg-[#B86300] text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-900/30 flex items-center justify-center gap-2"
            >
              Бесплатная диагностика
              <ChevronRight className="w-5 h-5" />
            </button>
            <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-lg transition-colors border border-white/30 backdrop-blur-sm">
              Наши услуги
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient fade to page bg */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#F5F2EC] to-transparent z-10"></div>
    </section>
    <RequestCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

