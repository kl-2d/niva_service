"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#C8553D]/10 flex items-center justify-center mx-auto mb-6">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C8553D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-10 h-10"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-[#1C1F23] mb-3">
                    Что-то пошло не так
                </h1>
                <p className="text-[#6B635C] mb-8 leading-relaxed">
                    Произошла непредвиденная ошибка. Попробуйте обновить страницу или
                    вернуться на главную.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#C8553D] hover:bg-[#A8442F] text-white rounded-xl font-bold transition-all shadow-btn"
                    >
                        Попробовать снова
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white border-2 border-[#D1CBC3] hover:border-[#C8553D]/40 text-[#1C1F23] rounded-xl font-semibold transition-all"
                    >
                        На главную
                    </Link>
                </div>
            </div>
        </div>
    );
}
