"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench, Settings, Car, Activity, Zap, Wind, PaintBucket, TrendingUp,
} from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Ремонт ходовой",
    description: "Подвеска, тормоза, рулевое управление",
    slug: "hodovoy",
    icon: Car,
    gradient: "from-blue-900/80 to-blue-700/60",
    accent: "border-blue-400/30",
  },
  {
    id: 2,
    title: "Ремонт двигателя",
    description: "Капремонт, ГРМ, поршневая группа",
    slug: "engine",
    icon: Settings,
    gradient: "from-red-900/80 to-red-700/60",
    accent: "border-red-400/30",
  },
  {
    id: 3,
    title: "Ремонт КПП",
    description: "Шумы, хрусты, выбивание передач",
    slug: "kpp",
    icon: Wrench,
    gradient: "from-stone-900/80 to-stone-700/60",
    accent: "border-stone-400/30",
  },
  {
    id: 4,
    title: "Ремонт раздатки",
    description: "Раздаточная коробка любой сложности",
    slug: "razdatka",
    icon: Activity,
    gradient: "from-amber-900/80 to-amber-700/60",
    accent: "border-amber-400/30",
  },
  {
    id: 5,
    title: "Редукторы",
    description: "Переборка мостов, установка самоблоков",
    slug: "reduktory",
    icon: TrendingUp,
    gradient: "from-emerald-900/80 to-emerald-700/60",
    accent: "border-emerald-400/30",
  },
  {
    id: 6,
    title: "Электрика",
    description: "Диагностика ЭСУД, ремонт проводки",
    slug: "electrics",
    icon: Zap,
    gradient: "from-yellow-900/80 to-yellow-700/60",
    accent: "border-yellow-400/30",
  },
  {
    id: 7,
    title: "Выхлопная система",
    description: "Глушители, резонаторы, катализаторы",
    slug: "vykhlopnaya",
    icon: Wind,
    gradient: "from-slate-900/80 to-slate-700/60",
    accent: "border-slate-400/30",
  },
  {
    id: 8,
    title: "Тюнинг",
    description: "Лифт-комплекты, лебёдки, грязевая резина",
    slug: "tuning",
    icon: PaintBucket,
    gradient: "from-orange-900/80 to-orange-700/60",
    accent: "border-orange-400/30",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-[#F5F2EC]" id="services-preview">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6 uppercase tracking-tight"
          >
            Направления ремонта
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-stone-500 text-base md:text-lg mb-6"
          >
            Выберите направление, чтобы перейти в каталог услуг
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#E07B00] mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <Link
                  href={`/services?cat=${cat.slug}`}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border ${cat.accent} bg-[#2B3A2E] hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-80 group-hover:opacity-90 transition-opacity`} />

                  {/* Pattern background */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "14px 14px"
                  }} />

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col gap-4 h-full min-h-[180px]">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#E07B00]/80 group-hover:border-[#E07B00] transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1.5 leading-tight group-hover:text-orange-200 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#E07B00] text-xs font-semibold group-hover:gap-3 transition-all duration-300">
                      <span>Смотреть прайс</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

