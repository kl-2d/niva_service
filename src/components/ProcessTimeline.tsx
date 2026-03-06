"use client";

import { motion } from "framer-motion";
import { MessageSquare, PhoneCall, Search, ClipboardList, Clock, Wrench, Key } from "lucide-react";

const steps = [
  { id: 1, label: "Заявка", desc: "Оставьте заявку на сайте или по телефону", icon: MessageSquare },
  { id: 2, label: "Звонок мастера", desc: "Согласование удобного времени заезда", icon: PhoneCall },
  { id: 3, label: "Осмотр и диагностика", desc: "Осмотр ходовой, агрегатов и составление списка неисправностей", icon: Search },
  { id: 4, label: "Смета и сроки", desc: "Согласование стоимости работ и запчастей", icon: Clock },
  { id: 5, label: "Ремонт", desc: "Профессиональное выполнение всех работ", icon: Wrench },
  { id: 6, label: "Выдача авто", desc: "Приемка работы, оплата, возврат автомобиля", icon: Key },
];

export default function ProcessTimeline() {
  return (
    <section className="py-20 md:py-28 bg-[#F0EDE8] border-t border-[#D1CBC3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F23]/8 border border-[#1C1F23]/15 text-[#1C1F23] text-xs font-bold uppercase tracking-[0.08em] mb-5"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Процесс работы
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#1C1F23] mb-6 uppercase tracking-tight"
          >
            Как мы работаем
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#C8553D] mx-auto rounded-full"
          />
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] bg-[#D1CBC3]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#1C1F23]/25 via-[#C8553D]/45 to-[#1C1F23]/25 origin-left"
            />
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-4 relative z-10 w-full overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory lg:snap-none">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row lg:flex-col items-start lg:items-center min-w-[280px] lg:min-w-0 lg:flex-1 shrink-0 group cursor-default"
                >
                  {/* Mobile vertical line */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute left-12 w-[2px] h-20 bg-[#D1CBC3] -z-10 mt-16 ml-[-1px]"></div>
                  )}

                  {/* Icon Node */}
                  <div className="relative shrink-0">
                    <div className="w-[88px] h-[88px] rounded-2xl bg-white border-2 border-[#D1CBC3] shadow-card flex items-center justify-center group-hover:bg-[#1C1F23] group-hover:border-[#1C1F23] group-hover:shadow-panel transition-all duration-300 z-20 relative">
                      <Icon className="w-8 h-8 text-[#1C1F23] group-hover:text-[#E8A88C] transition-colors duration-300" />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#C8553D] flex items-center justify-center font-black text-white text-sm border-4 border-[#F0EDE8] shadow-sm">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ml-6 lg:ml-0 lg:mt-5 lg:text-center pt-2 lg:pt-0">
                    <h3 className="text-[#1C1F23] font-bold text-base mb-1.5 group-hover:text-[#C8553D] transition-colors">
                      {step.label}
                    </h3>
                    <p className="text-[#6B635C] text-sm leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
