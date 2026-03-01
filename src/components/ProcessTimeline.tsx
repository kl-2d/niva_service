"use client";

import { motion } from "framer-motion";
import { MessageSquare, PhoneCall, Stethoscope, ClipboardList, Clock, Wrench, Key } from "lucide-react";

const steps = [
  { id: 1, label: "Заявка", desc: "Оставьте заявку на сайте или по телефону", icon: MessageSquare },
  { id: 2, label: "Звонок мастера", desc: "Согласование удобного времени заезда", icon: PhoneCall },
  { id: 3, label: "Бесплатная диагностика", desc: "Комплексный осмотр ходовой и агрегатов", icon: Stethoscope },
  { id: 4, label: "Дефектовка", desc: "Составление списка неисправностей", icon: ClipboardList },
  { id: 5, label: "Смета и сроки", desc: "Согласование стоимости работ и запчастей", icon: Clock },
  { id: 6, label: "Ремонт", desc: "Профессиональное выполнение всех работ", icon: Wrench },
  { id: 7, label: "Выдача авто", desc: "Приемка работы, оплата, возврат автомобиля", icon: Key },
];

export default function ProcessTimeline() {
  return (
    <section className="py-24 bg-[#F5F2EC] border-t border-[#D4CFC8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6 uppercase tracking-tight"
          >
            Как мы работаем
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#E07B00] mx-auto rounded-full"
          />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] bg-stone-200">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-[#E07B00]/30 origin-left"
            />
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-4 relative z-10 w-full overflow-x-auto lg:overflow-visible pb-8 hide-scrollbar">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row lg:flex-col items-start lg:items-center min-w-[280px] lg:min-w-0 lg:w-40 shrink-0 group"
                >
                  {/* Vertical connecting line for mobile only */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute left-12 w-[2px] h-20 bg-stone-200 -z-10 mt-16 ml-[-1px]"></div>
                  )}

                  {/* Icon Node */}
                  <div className="relative">
                    <div className="w-24 h-24 lg:w-24 lg:h-24 rounded-full bg-white border border-[#D4CFC8] shadow-sm flex items-center justify-center shrink-0 hover:border-[#E07B00] transition-colors z-20 relative">
                      <Icon className="w-8 h-8 text-[#2B3A2E] group-hover:text-[#E07B00] group-hover:scale-110 transition-all" />
                    </div>
                    
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#E07B00] flex items-center justify-center font-bold text-white text-sm border-4 border-[#F5F2EC] shadow-sm">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ml-6 lg:ml-0 lg:mt-6 lg:text-center pt-2 lg:pt-0">
                    <h3 className="text-[#1A1A1A] font-bold mb-2 group-hover:text-[#E07B00] transition-colors">
                      {step.label}
                    </h3>
                    <p className="text-stone-700 text-sm leading-snug">
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
