"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Calendar, X } from "lucide-react";
import RequestCallModal from "./RequestCallModal";

interface PromoData {
    id: number;
    title: string;
    description: string | null;
    isActive: boolean;
    eventDate: string | null;
}

export default function PromoBanner() {
    const [promo, setPromo] = useState<PromoData | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/promo")
            .then((r) => r.json())
            .then((data: PromoData) => {
                if (data?.isActive) setPromo(data);
            })
            .catch(() => { });
    }, []);

    if (!promo || dismissed) return null;

    const formattedDate = promo.eventDate
        ? new Date(promo.eventDate).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : null;

    return (
        <>
            <AnimatePresence>
                {!dismissed && (
                    <motion.section
                        key="promo-banner"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative bg-gradient-to-r from-[#1C2E1E] via-[#2B3A2E] to-[#1C2E1E] border-b border-[#E07B00]/30 overflow-hidden"
                    >
                        {/* Animated background pulse */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E07B00] rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#E07B00] rounded-full blur-3xl animate-pulse delay-1000" />
                        </div>

                        <div className="relative max-w-7xl mx-auto px-4 py-5">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                                <div className="flex items-center gap-4 flex-1">
                                    {/* Icon */}
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#E07B00]/20 border border-[#E07B00]/40 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-[#E07B00]" />
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="relative flex h-2 w-2 shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B00] opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07B00]" />
                                            </span>
                                            <span className="text-[#E07B00] text-xs font-bold uppercase tracking-widest">
                                                Акция
                                            </span>
                                        </div>
                                        <p className="text-white font-bold text-base md:text-lg leading-tight">
                                            {promo.title}
                                        </p>
                                        {promo.description && (
                                            <p className="text-stone-300 text-sm mt-0.5">{promo.description}</p>
                                        )}
                                        {formattedDate && (
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-[#E07B00] shrink-0" />
                                                <span className="text-stone-300 text-xs">Дата акции: <b className="text-white">{formattedDate}</b></span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => setModalOpen(true)}
                                        className="px-6 py-2.5 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold rounded-xl text-sm transition-all transform hover:scale-105 shadow-lg shadow-orange-900/30"
                                    >
                                        Записаться
                                    </button>
                                    <button
                                        onClick={() => setDismissed(true)}
                                        className="p-2 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                                        title="Закрыть"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <RequestCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
