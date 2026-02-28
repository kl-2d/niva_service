"use client";

import { motion } from "framer-motion";
import { 
  Wrench, 
  Settings, 
  Car, 
  Activity, 
  Zap, 
  Wind, 
  PaintBucket, 
  TrendingUp 
} from "lucide-react";

export const services = [
  {
    id: 1,
    title: "Ремонт ходовой",
    description: "Комплексная диагностика и ремонт подвески для уверенной езды по бездорожью.",
    icon: Car,
  },
  {
    id: 2,
    title: "Ремонт двигателя",
    description: "Капитальный ремонт, замена ГРМ, поршневой группы. Используем только оригинальные запчасти.",
    icon: Settings,
  },
  {
    id: 3,
    title: "Ремонт КПП",
    description: "Устранение шумов, хрустов, выбивания передач. Усиление коробок.",
    icon: Wrench,
  },
  {
    id: 4,
    title: "Ремонт раздатки",
    description: "Ремонт раздаточной коробки любой сложности. Центровка, замена подшипников.",
    icon: Activity,
  },
  {
    id: 5,
    title: "Редукторы",
    description: "Переборка редукторов переднего и заднего мостов. Установка самоблоков.",
    icon: TrendingUp,
  },
  {
    id: 6,
    title: "Электрика",
    description: "Компьютерная диагностика ЭСУД, ремонт проводки, установка доп. оборудования.",
    icon: Zap,
  },
  {
    id: 7,
    title: "Выхлоп",
    description: "Замена глушителей, резонаторов, катализаторов. Установка прямотока.",
    icon: Wind,
  },
  {
    id: 8,
    title: "Тюнинг",
    description: "Лифт-комплекты, силовые бампера, лебедки, грязевая резина P-A/T M/T.",
    icon: PaintBucket,
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-stone-50" id="services">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 uppercase tracking-tight"
          >
            Перечень ремонтных работ
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-orange-500 mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-stone-200 hover:border-orange-300 rounded-xl p-6 transition-all group hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-stone-700 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
