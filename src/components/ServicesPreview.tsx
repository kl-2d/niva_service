"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Wrench, Settings, Car, Activity, Zap, Wind, PaintBucket, TrendingUp } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Ремонт ходовой",
    description: "Подвеска, тормоза, рулевое управление",
    slug: "perednyaya-podveska",
    icon: Car,
    gradient: "from-stone-900/80 to-stone-700/60",
    accent: "border-stone-400/30",
    shadow: "hover:shadow-stone-900/30",
  },
  {
    id: 2,
    title: "Ремонт двигателя",
    description: "Капремонт, ГРМ, поршневая группа",
    slug: "dvigatel",
    icon: Settings,
    gradient: "from-red-950/80 to-red-900/60",
    accent: "border-red-400/30",
    shadow: "hover:shadow-red-950/30",
  },
  {
    id: 3,
    title: "Ремонт КПП",
    description: "Шумы, хрусты, выбивание передач",
    slug: "kpp",
    icon: Wrench,
    gradient: "from-zinc-900/80 to-zinc-700/60",
    accent: "border-zinc-400/30",
    shadow: "hover:shadow-zinc-900/30",
  },
  {
    id: 4,
    title: "Ремонт раздатки",
    description: "Раздаточная коробка любой сложности",
    slug: "razdatka",
    icon: Activity,
    gradient: "from-amber-950/80 to-amber-900/60",
    accent: "border-amber-400/30",
    shadow: "hover:shadow-amber-950/30",
  },
  {
    id: 5,
    title: "Редукторы",
    description: "Переборка мостов, установка самоблоков",
    slug: "peredniy-most",
    icon: TrendingUp,
    gradient: "from-emerald-950/80 to-emerald-900/60",
    accent: "border-emerald-400/30",
    shadow: "hover:shadow-emerald-950/30",
  },
  {
    id: 6,
    title: "Электрика",
    description: "Диагностика ЭСУД, ремонт проводки",
    slug: "electro",
    icon: Zap,
    gradient: "from-yellow-950/80 to-yellow-900/60",
    accent: "border-yellow-400/30",
    shadow: "hover:shadow-yellow-950/30",
  },
  {
    id: 7,
    title: "Выхлопная система",
    description: "Глушители, резонаторы, катализаторы",
    slug: "vypusk",
    icon: Wind,
    gradient: "from-neutral-900/80 to-neutral-700/60",
    accent: "border-neutral-400/30",
    shadow: "hover:shadow-neutral-900/30",
  },
  {
    id: 8,
    title: "Тюнинг",
    description: "Лифт-комплекты, лебёдки, грязевая резина",
    slug: "modernizatsiya",
    icon: PaintBucket,
    gradient: "from-orange-950/80 to-orange-900/60",
    accent: "border-orange-400/30",
    shadow: "hover:shadow-orange-950/30",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 md:py-28 bg-[#E6E2DC]" id="services-preview">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F23]/8 border border-[#1C1F23]/15 text-[#1C1F23] text-xs font-bold uppercase tracking-[0.08em] mb-5"
          >
            <Wrench className="w-3.5 h-3.5" />
            Специализация
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#1C1F23] mb-4 uppercase tracking-tight"
          >
            Направления ремонта
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6B635C] text-base md:text-lg mb-6 max-w-xl mx-auto"
          >
            Выберите направление, чтобы перейти в каталог услуг
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="h-1 bg-[#C8553D] mx-auto rounded-full"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 ${cat.accent} bg-[#1C1F23] hover:shadow-2xl ${cat.shadow} transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-80 group-hover:opacity-95 transition-opacity duration-300`} />

                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "14px 14px"
                  }} />

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8553D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col gap-4 h-full min-h-[190px]">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-[#C8553D] group-hover:border-[#C8553D] transition-all duration-300 shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1.5 leading-tight group-hover:text-[#FAE8E4] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-[#E8A88C] text-sm font-bold mt-auto">
                      <span>Смотреть прайс</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
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
