"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const symptoms = [
  "Плавающие обороты",
  "Пропала тяга / не разгоняется",
  "Белый или черный дым из выхлопной",
  "Троит двигатель (пропуски зажигания)",
  "Повышенный расход масла (масложор)",
  "Стуки и посторонние шумы в двигателе",
];

const prices = [
  { service: "Компьютерная диагностика ЭСУД", price: "600" },
  { service: "Замена гидрокомпенсаторов", price: "2 100" },
  { service: "Замена датчика РХХ", price: "350" },
  { service: "Замена датчика детонации", price: "360" },
  { service: "Замена масла в двигателе с фильтром", price: "350" },
  { service: "Регулировка клапанов", price: "750" },
  { service: "Снятие, установка, ремонт ГБЦ", price: "6 000" },
];

export default function EnginePricing() {
  return (
    <section className="py-20 bg-zinc-900 border-t border-zinc-800" id="engine-repair">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Context / Symptoms */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="sticky top-24"
            >
              <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                Ремонт двигателя
              </h2>
              <p className="text-zinc-400 mb-6 text-lg">
                Капитальный и текущий ремонт двигателей ВАЗ. Точная диагностика и честные цены на работы.
              </p>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 text-orange-400 font-semibold">
                  <AlertCircle className="w-6 h-6" />
                  <h3>Вам нужен ремонт, если:</h3>
                </div>
                <ul className="space-y-3">
                  {symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-zinc-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Pricing Table */}
          <div className="lg:w-2/3 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 md:p-8 bg-zinc-900/50 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Прайс-лист на популярные работы</h3>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">Цены в рублях</span>
              </div>
              
              <div className="p-6 md:p-8">
                <ul className="space-y-4">
                  {prices.map((item, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-end gap-4 group"
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-orange-500/50 group-hover:text-orange-500 transition-colors" />
                        <span className="text-zinc-300 group-hover:text-white transition-colors">{item.service}</span>
                      </div>
                      
                      {/* Dotted Leader */}
                      <div className="flex-grow border-b border-dotted border-zinc-700 mb-1 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="shrink-0 font-mono text-lg font-medium text-white">
                        {item.price} ₽
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-zinc-800 text-sm text-zinc-500">
                  * Цены указаны за работу сторонних запчастей. Точная стоимость может меняться в зависимости от модели (2121, 21214, Шнива).
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
