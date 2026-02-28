"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { services } from "@/components/Services";

export default function ServicesPreview() {
  const previewServices = services.slice(0, 4);

  return (
    <section className="py-24 bg-slate-50" id="services-preview">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tight"
          >
            Направления ремонта
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-blue-600 mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-6 transition-all group hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link 
            href="/services"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg"
          >
            Перейти в полный каталог услуг
          </Link>
        </div>
      </div>
    </section>
  );
}
