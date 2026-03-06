"use client";

import { motion } from "framer-motion";
import { Award, Shield, Wrench, MapPin, Phone, Mail, Clock, Video, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoReview {
  id: number;
  videoUrl: string;
  description: string | null;
  reviewDate: string;
}

function detectPlatform(url: string): "rutube" | "youtube" | null {
  if (/rutube\.ru/.test(url)) return "rutube";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  return null;
}

function getEmbedUrl(url: string): string | null {
  const platform = detectPlatform(url);
  if (platform === "rutube") {
    const m = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
    return m ? `https://rutube.ru/play/embed/${m[1]}` : null;
  }
  if (platform === "youtube") {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  }
  return null;
}

export default function AboutPage() {
  const yearsOfWork = new Date().getFullYear() - 2008;
  const [reviews, setReviews] = useState<VideoReview[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => { });
  }, []);

  return (
    <div className="pt-8 pb-24 bg-[#F0EDE8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://niva-service.ru" },
              { "@type": "ListItem", position: 2, name: "О нас", item: "https://niva-service.ru/about" },
            ],
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F23]/10 border border-[#1C1F23]/20 text-[#1C1F23] text-sm font-bold uppercase tracking-widest mb-5"
          >
            <Wrench className="w-3.5 h-3.5" />
            Нива Сервис Воронеж
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[#1C1F23] mb-6 uppercase tracking-tight"
          >
            О компании
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "80px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-[#C8553D] mx-auto rounded-full"
          />
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#1C1F23] mb-6">
              Специализированный сервис НИВА
            </h2>
            <p className="text-lg text-[#6B635C] mb-6 leading-relaxed">
              Мы более {yearsOfWork} лет занимаемся исключительно ремонтом и тюнингом автомобилей семейства Нива.
              За это время мы накопили колоссальный опыт решения самых нестандартных проблем и разработали
              собственные технологические решения, подтвержденные патентами.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1C1F23] flex items-center justify-center text-[#C8553D] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#1C1F23] text-base">{yearsOfWork} лет опыта</h4>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1C1F23] flex items-center justify-center text-[#C8553D] shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#1C1F23] text-base">Запатентованные технологии</h4>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1C1F23] flex items-center justify-center text-[#C8553D] shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#1C1F23] text-base">Узкая специализация</h4>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#E6E2DC] rounded-2xl h-80 lg:h-96 flex items-center justify-center text-[#6B635C] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F23]/40 via-transparent to-[#C8553D]/10 z-10" />
            <img
              src="/XXXL.webp"
              alt="Автосервис Нива Сервис — мастерская в Воронеже"
              className="w-full h-full object-cover brightness-110 contrast-105 saturate-110"
            />
          </motion.div>
        </div>

        {/* Video Reviews */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F23]/10 border border-[#1C1F23]/20 text-[#1C1F23] text-sm font-bold uppercase tracking-widest mb-4"
            >
              <Video className="w-3.5 h-3.5" />
              Отзывы клиентов
            </motion.div>
            <h3 className="text-3xl font-black text-[#1C1F23] mb-3 uppercase tracking-tight">Видео отзывы наших клиентов</h3>
            <p className="text-[#6B635C] text-base">Посмотрите, что говорят владельцы Нив о нашей работе</p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-[#9C9488]">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Отзывы скоро появятся</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => {
                const embedUrl = getEmbedUrl(review.videoUrl);
                const platform = detectPlatform(review.videoUrl);
                const fmtDate = new Date(review.reviewDate).toLocaleDateString("ru-RU", {
                  day: "numeric", month: "long", year: "numeric",
                });
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-[#D1CBC3] hover:border-[#C8553D]/30 hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Video embed */}
                    <div className="aspect-video bg-[#1C1F23] relative">
                      {embedUrl ? (
                        <iframe
                          className="w-full h-full"
                          src={embedUrl}
                          title="Видео отзыв клиента Нива Сервис"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B635C]">
                          <Video className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1.5 border-t border-[#DDD8D1]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#1C1F23] flex items-center justify-center shrink-0">
                          <Video className="w-3.5 h-3.5 text-[#C8553D]" />
                        </div>
                        <p className="text-sm font-bold text-[#1C1F23]">{fmtDate}</p>
                      </div>
                      {review.description && (
                        <p className="text-sm text-[#6B635C] leading-snug">{review.description}</p>
                      )}
                      <a
                        href={review.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#9C9488] hover:text-[#C8553D] transition-colors mt-1 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {platform === "rutube" ? "Открыть на Rutube" : platform === "youtube" ? "Открыть на YouTube" : "Открыть видео"}
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contacts & Map */}
        <div className="bg-white border-2 border-[#D1CBC3] rounded-2xl overflow-hidden shadow-lg" id="contacts">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-8 lg:p-12 bg-[#1C1F23]">
              <h3 className="text-2xl font-black text-white mb-8">Контакты</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8553D] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Адрес</h4>
                    <p className="text-[#8C8378] mt-1">г. Воронеж, ул. Матросова, 100</p>
                    <a
                      href="https://yandex.ru/maps/-/CPqZM2Il"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#C8553D] hover:underline mt-1 inline-block"
                    >
                      Открыть на Яндекс Картах →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8553D] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Телефоны</h4>
                    <div className="mt-1 space-y-1">
                      <a href="tel:+79202295656" className="block text-[#8C8378] hover:text-[#C8553D] transition-colors text-base" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>+7 920 229-56-56</a>
                      <a href="tel:+74732361818" className="block text-[#8C8378] hover:text-[#C8553D] transition-colors text-base" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>+7 473 236-18-18</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8553D] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Email</h4>
                    <a href="mailto:niva36@mail.ru" className="text-[#8C8378] hover:text-[#C8553D] transition-colors mt-1 block">niva36@mail.ru</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8553D] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Режим работы</h4>
                    <p className="text-[#8C8378] mt-1">Пн-Пт: 9:00 — 18:00</p>
                    <p className="text-[#8C8378] mt-0.5">Сб: 10:00 — 16:00</p>
                    <p className="text-[#6B635C] mt-0.5">Вс: Выходной</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 h-[400px] lg:h-auto bg-[#E6E2DC]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=39.154615%2C51.643812&z=16&pt=39.154615%2C51.643812,pm2rdm&mode=poi"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Нива Сервис на карте — ул. Матросова, 100, Воронеж"
                className="w-full h-full grayscale-[20%] contrast-125"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
