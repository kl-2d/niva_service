import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Страница не найдена",
};

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 number */}
                <div
                    className="text-[8rem] md:text-[10rem] font-black leading-none text-[#D1CBC3] select-none"
                    style={{ fontFamily: "var(--font-oswald)" }}
                >
                    404
                </div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-[#1C1F23] mb-3 -mt-4">
                    Страница не найдена
                </h1>
                <p className="text-[#6B635C] mb-8 leading-relaxed">
                    Возможно, страница была перемещена или удалена. Проверьте адрес или
                    вернитесь на главную.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[#C8553D] hover:bg-[#A8442F] text-white rounded-xl font-bold transition-all shadow-btn"
                    >
                        На главную
                    </Link>
                    <Link
                        href="/services"
                        className="px-6 py-3 bg-white border-2 border-[#D1CBC3] hover:border-[#C8553D]/40 text-[#1C1F23] rounded-xl font-semibold transition-all"
                    >
                        Услуги и цены
                    </Link>
                </div>
            </div>
        </div>
    );
}
