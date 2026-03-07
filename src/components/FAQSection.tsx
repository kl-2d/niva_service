"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const faqItems = [
    {
        question: "Какие автомобили вы ремонтируете?",
        answer:
            "Мы специализируемся на автомобилях семейства НИВА: ВАЗ-2121/21213/21214, Chevrolet Niva (ВАЗ-2123), Lada 4×4, Niva Travel и Lada Niva Legend. Также принимаем и другие марки автомобилей.",
    },
    {
        question: "Сколько стоит диагностика Нивы?",
        answer:
            "Стоимость диагностики зависит от типа: осмотр ходовой части — от 500 ₽, компьютерная диагностика двигателя — от 800 ₽. При заказе ремонта стоимость диагностики может быть включена в работу. Точную цену уточняйте по телефону.",
    },
    {
        question: "Какой режим работы автосервиса?",
        answer:
            "Мы работаем с понедельника по пятницу с 9:00 до 18:00, в субботу с 10:00 до 16:00. Воскресенье — выходной. Находимся по адресу: г. Воронеж, ул. Матросова, 100.",
    },
    {
        question: "Даёте ли вы гарантию на ремонт?",
        answer:
            "Да, мы предоставляем гарантию на все выполненные работы. Срок гарантии зависит от вида ремонта и составляет от 3 до 12 месяцев. Гарантия распространяется как на работу, так и на установленные нами запчасти.",
    },
    {
        question: "Можно ли привезти свои запчасти?",
        answer:
            "Да, вы можете привезти свои запчасти. Однако в этом случае гарантия распространяется только на выполненную работу, но не на предоставленные вами детали. Мы рекомендуем использовать проверенные запчасти от наших поставщиков.",
    },
    {
        question: "Как записаться на ремонт?",
        answer:
            "Записаться можно по телефону +7 920 229-56-56 или +7 473 236-18-18, а также через форму заявки на сайте. Мастер перезвонит вам для согласования удобного времени заезда.",
    },
    {
        question: "Сколько времени занимает ремонт?",
        answer:
            "Сроки зависят от сложности работы. Замена расходников и мелкий ремонт — от 1 часа. Ремонт КПП или раздатки — 1–2 дня. Капитальный ремонт двигателя — 3–5 дней. Точные сроки мастер определит после осмотра автомобиля.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <>
            {/* JSON-LD FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: faqItems.map((item) => ({
                            "@type": "Question",
                            name: item.question,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: item.answer,
                            },
                        })),
                    }),
                }}
            />

            <section className="py-20 md:py-28 bg-[#F0EDE8] border-t border-[#D1CBC3]">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F23]/8 border border-[#1C1F23]/15 text-[#1C1F23] text-xs font-bold uppercase tracking-[0.08em] mb-5"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Вопрос-ответ
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-black text-[#1C1F23] mb-4 uppercase tracking-tight"
                        >
                            Частые вопросы
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-[#6B635C] text-base md:text-lg mb-6 max-w-xl mx-auto"
                        >
                            Ответы на самые популярные вопросы наших клиентов
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            whileInView={{ opacity: 1, width: "80px" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="h-1 bg-[#C8553D] mx-auto rounded-full"
                        />
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-3">
                        {faqItems.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ delay: index * 0.06 }}
                                >
                                    <div
                                        className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${isOpen
                                                ? "border-[#C8553D]/30 shadow-card-hover"
                                                : "border-[#D1CBC3] shadow-card hover:border-[#C8553D]/20"
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggle(index)}
                                            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="text-[#1C1F23] font-bold text-base leading-snug">
                                                {item.question}
                                            </span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-[#C8553D] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="px-6 pb-5 pt-0">
                                                <div className="h-px bg-[#D1CBC3] mb-4" />
                                                <p className="text-[#6B635C] text-sm leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
