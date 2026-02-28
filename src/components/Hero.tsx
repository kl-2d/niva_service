"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-stone-100 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625047509168-a7026f36de04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-stone-100/80 backdrop-blur-[2px]"></div>
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
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-stone-800 bg-stone-200 border border-stone-300 rounded-full shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Работаем для вас с 2008 года
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-stone-900 mb-6 uppercase tracking-tight leading-tight"
          >
            Комплексный ремонт автомобилей <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">НИВА</span> и CHEVROLET NIVA
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-2xl text-stone-700 mb-10 max-w-2xl mx-auto font-light"
          >
            В единственном специализированном сервисе Воронежа. Качество, проверенное временем.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
              Бесплатная диагностика
              <ChevronRight className="w-5 h-5" />
            </button>
            <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-stone-50 hover:bg-stone-200 text-stone-900 rounded-lg font-medium text-lg transition-colors border border-stone-300 shadow-sm">
              Наши услуги
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay at the bottom */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-stone-50 to-transparent z-10"></div>
    </section>
  );
}
