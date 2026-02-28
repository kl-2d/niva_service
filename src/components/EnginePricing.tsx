"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { Service } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";

const symptoms = [
  "Плавающие обороты",
  "Пропала тяга / не разгоняется",
  "Белый или черный дым из выхлопной",
  "Троит двигатель (пропуски зажигания)",
  "Повышенный расход масла (масложор)",
  "Стуки и посторонние шумы в двигателе",
];

export default function EnginePricing() {
  const [prices, setPrices] = useState<Service[]>([]);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrices(data.filter(s => s.category === "engine"));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200" id="engine-repair">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="sticky top-24"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
                Ремонт двигателя
              </h2>
              <p className="text-slate-600 mb-6 text-lg">
                Капитальный и текущий ремонт двигателей ВАЗ. Точная диагностика и честные цены на работы.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-blue-700 font-semibold">
                  <AlertCircle className="w-6 h-6" />
                  <h3>Вам нужен ремонт, если:</h3>
                </div>
                <ul className="space-y-3">
                  {symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Прайс-лист на работы</h3>
                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">Цены в рублях</span>
              </div>
              
              <div className="p-6 md:p-8">
                <ul className="space-y-4">
                  {prices.map((item, idx) => {
                    const isAdded = items.some(i => i.id === item.id);
                    return (
                      <motion.li 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-end gap-4 group"
                      >
                        <div className="flex items-center gap-3 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-blue-200 group-hover:text-blue-600 transition-colors" />
                          <span className="text-slate-700 group-hover:text-slate-900 font-medium transition-colors">{item.title}</span>
                        </div>
                        
                        <div className="flex-grow border-b border-dotted border-slate-300 mb-1 opacity-50 group-hover:border-blue-300 transition-colors"></div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-mono text-lg font-bold text-slate-800">
                            {item.price} ₽
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            disabled={isAdded}
                            className={`flex items-center justify-center p-2 rounded transition-colors ${
                              isAdded 
                                ? "bg-green-50 text-green-600 border border-green-200 cursor-not-allowed" 
                                : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white"
                            }`}
                          >
                            {isAdded ? "Добавлено" : <Plus className="w-5 h-5" />}
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                  {prices.length === 0 && (
                    <li className="text-center text-slate-500 py-4">Загрузка прайс-листа...</li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
