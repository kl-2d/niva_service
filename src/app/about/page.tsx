"use client";

import { motion } from "framer-motion";
import { Award, Shield, Wrench, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-8 pb-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 uppercase tracking-tight"
          >
            О компании
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "80px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#E07B00] mx-auto rounded-full"
          />
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-stone-900 mb-6">
              Специализированный сервис НИВА
            </h2>
            <p className="text-lg text-stone-700 mb-6 leading-relaxed">
              Мы более 15 лет занимаемся исключительно ремонтом и тюнингом автомобилей семейства Нива. 
              За это время мы накопили колоссальный опыт решения самых нестандартных проблем и разработали 
              собственные технологические решения, подтвержденные патентами.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#E07B00] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">15 лет опыта</h4>
                  <p className="text-stone-700 text-sm">Знаем каждую гайку в Ниве</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#E07B00] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">Запатентованные технологии</h4>
                  <p className="text-stone-700 text-sm">Уникальные решения по усилению узлов</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#E07B00] shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">Узкая специализация</h4>
                  <p className="text-stone-700 text-sm">Ремонтируем только Нивы и Шевроле Нива</p>
                </div>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-stone-100 rounded-2xl h-80 flex items-center justify-center text-stone-500 overflow-hidden relative"
          >
            {/* Placeholder for an actual photo of the garage */}
            <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply" />
            <img 
              src="https://images.unsplash.com/photo-1611155876008-62025f191b7d?q=80&w=1000&auto=format&fit=crop" 
              alt="Ремонтная зона Нива Сервис" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Video Reviews */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Видео отзывы наших клиентов</h3>
            <p className="text-stone-700">Посмотрите, что говорят владельцы Нив о нашей работе</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="aspect-video bg-stone-200 rounded-xl overflow-hidden relative shadow-sm"
              >
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contacts & Map */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm" id="contacts">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-8 lg:p-12 bg-white">
              <h3 className="text-2xl font-bold text-stone-900 mb-8">Контакты</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#E07B00] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Адрес</h4>
                    <p className="text-stone-700 mt-1">г. Воронеж, ул. Матросова, 100</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#E07B00] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Телефоны</h4>
                    <div className="mt-1 space-y-1">
                      <a href="tel:+79202295656" className="block text-stone-700 hover:text-[#E07B00] transition-colors">+7 920 229-56-56</a>
                      <a href="tel:+74732361818" className="block text-stone-700 hover:text-[#E07B00] transition-colors">+7 473 236-18-18</a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-[#E07B00] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Email</h4>
                    <a href="mailto:info@niva-service.ru" className="text-stone-700 hover:text-[#E07B00] transition-colors mt-1 block">info@niva-service.ru</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[#E07B00] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-stone-900">Режим работы</h4>
                    <p className="text-stone-700 mt-1">Пн-Вс: 9:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3 h-[400px] lg:h-auto bg-gray-200">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=39.158141%2C51.637505&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjQyMDk3NxJI0KDQvtGB0YHQuNGPLCDQktC-0YDQvtC90LXQtiwg0YPQu9C40YbQsCDQnNCw0YLRgNC-0YHQvtCy0LAsIDEwMCIKDQnQ_UEVX8BMQg%2C%2C&z=16.63" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                className="w-full h-full grayscale-[20%] contrast-125"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

