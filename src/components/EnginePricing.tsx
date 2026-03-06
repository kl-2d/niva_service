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
    <section className="py-20 bg-white border-t border-[#D1CBC3]" id="engine-repair">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="sticky top-24"
            >
              <h2 className="text-3xl font-bold text-[#1C1F23] mb-6 uppercase tracking-tight">
                Ремонт двигателя
              </h2>
              <p className="text-[#6B635C] mb-6 text-lg">
                Капитальный и текущий ремонт двигателей ВАЗ. Точная диагностика и честные цены на работы.
              </p>

              <div className="bg-[#FAE8E4] border border-[#E8C5B8] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-[#1C1F23] font-bold">
                  <AlertCircle className="w-6 h-6 text-[#C8553D]" />
                  <h3>Вам нужен ремонт, если:</h3>
                </div>
                <ul className="space-y-3">
                  {symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#6B635C] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C8553D] mt-2 shrink-0" />
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
              className="bg-white border border-[#D1CBC3] rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="p-6 md:p-8 bg-[#E6E2DC] border-b border-[#D1CBC3] flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1C1F23]">Прайс-лист на работы</h3>
                <span className="text-xs text-[#6B635C] bg-white border border-[#D1CBC3] px-3 py-1 rounded-full shadow-sm">Цены в рублях</span>
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
                          <CheckCircle2 className="w-5 h-5 text-[#E8C5B8] group-hover:text-[#C8553D] transition-colors" />
                          <span className="text-[#6B635C] group-hover:text-[#1C1F23] font-medium transition-colors">{item.title}</span>
                        </div>

                        <div className="flex-grow border-b border-dotted border-[#D1CBC3] mb-1 opacity-50 group-hover:border-[#C8553D]/40 transition-colors"></div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-lg font-bold text-[#1C1F23]" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>
                            {item.price} ₽
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            disabled={isAdded}
                            className={`flex items-center justify-center p-2 rounded transition-colors font-bold ${isAdded
                              ? "bg-[#E6E2DC] text-[#9C9488] border border-[#D1CBC3] cursor-not-allowed"
                              : "bg-[#FAE8E4] text-[#1C1F23] border border-[#E8C5B8] hover:bg-[#C8553D] hover:text-white hover:border-[#C8553D]"
                              }`}
                          >
                            {isAdded ? "Добавлено" : <Plus className="w-5 h-5" />}
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                  {prices.length === 0 && (
                    <li className="text-center text-[#9C9488] py-4">Загрузка прайс-листа...</li>
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
