"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, Calendar, Users, Wrench } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate(v) {
          setCount(Math.round(v));
        },
      });
      return controls.stop;
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const FOUNDED_YEAR = 2008;

function getStats() {
  const yearsOfWork = new Date().getFullYear() - FOUNDED_YEAR;
  return [
    {
      id: 1,
      icon: ShieldCheck,
      value: 100,
      suffix: "%",
      label: "гарантия качества",
      iconBg: "bg-[#1C1F23]",
      iconColor: "text-[#E8A88C]",
    },
    {
      id: 2,
      icon: Calendar,
      value: yearsOfWork,
      suffix: " лет",
      label: "успешной работы",
      iconBg: "bg-[#1C1F23]",
      iconColor: "text-[#E8A88C]",
    },
    {
      id: 3,
      icon: Users,
      value: 10,
      suffix: "",
      label: "высококлассных специалистов",
      iconBg: "bg-[#C8553D]",
      iconColor: "text-white",
    },
    {
      id: 4,
      icon: Wrench,
      value: 2000,
      suffix: "+",
      label: "выполненных заказов в год",
      iconBg: "bg-[#C8553D]",
      iconColor: "text-white",
    },
  ];
}

export default function Statistics() {
  const stats = getStats();
  return (
    <section className="py-20 md:py-24 bg-[#E6E2DC] border-b border-[#D1CBC3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center p-7 bg-white rounded-2xl border-2 border-[#D1CBC3] hover:border-[#C8553D]/40 transition-all duration-300 group shadow-card hover:shadow-card-hover hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
                </div>

                {/* Number */}
                <h3 className="text-5xl md:text-6xl font-black text-[#1C1F23] mb-2 tabular-nums leading-none" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>

                {/* Label */}
                <p className="text-[#6B635C] text-center uppercase tracking-wider text-xs font-bold mt-1">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
