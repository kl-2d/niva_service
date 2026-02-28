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

const stats = [
  {
    id: 1,
    icon: ShieldCheck,
    value: 100,
    suffix: "%",
    label: "гарантия качества",
    color: "text-blue-500",
  },
  {
    id: 2,
    icon: Calendar,
    value: 15,
    suffix: " лет",
    label: "успешной работы",
    color: "text-blue-600",
  },
  {
    id: 3,
    icon: Users,
    value: 10,
    suffix: "",
    label: "высококлассных специалистов",
    color: "text-green-500",
  },
  {
    id: 4,
    icon: Wrench,
    value: 2000,
    suffix: "+",
    label: "выполненных заказов в год",
    color: "text-red-500",
  },
];

export default function Statistics() {
  return (
    <section className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group shadow-sm hover:shadow"
              >
                <div className={`p-4 rounded-full bg-white border border-gray-100 mb-4 group-hover:bg-gray-50 transition-colors ${stat.color}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-mono tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-500 text-center uppercase tracking-wider text-sm font-medium">
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
