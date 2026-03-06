"use client";

import { useState, FormEvent } from "react";
import { Wrench, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RecoveryPage() {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/recovery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recoveryToken: token }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error ?? "Ошибка восстановления");
            }
        } catch {
            setError("Ошибка сети. Попробуйте ещё раз.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#1C1F23] flex items-center justify-center p-4">
            {/* Background texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C8553D] mb-4 shadow-lg shadow-[#C8553D]/30">
                        <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h1
                        className="text-2xl font-bold text-white uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-oswald, sans-serif)" }}
                    >
                        Нива Сервис
                    </h1>
                    <p className="text-[#8C8378] text-sm mt-1">Восстановление доступа</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mx-auto">
                                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h2 className="text-white font-semibold text-lg">
                                Пароль сброшен
                            </h2>
                            <p className="text-[#8C8378] text-sm leading-relaxed">
                                Пароль восстановлен на значение по умолчанию. Используйте его для
                                входа в систему.
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-flex items-center gap-2 bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold py-3 px-6 rounded-xl transition mt-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Войти
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-white font-semibold text-lg mb-2">
                                Сброс пароля
                            </h2>
                            <p className="text-[#8C8378] text-sm mb-6">
                                Введите токен восстановления, полученный от разработчика.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[#8C8378] text-xs font-medium mb-1.5 uppercase tracking-wider">
                                        Токен восстановления
                                    </label>
                                    <input
                                        type="text"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#6B635C] focus:outline-none focus:border-[#C8553D] focus:ring-1 focus:ring-[#C8553D] transition disabled:opacity-50 font-mono text-sm"
                                        placeholder="Вставьте токен сюда..."
                                        autoComplete="off"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !token.trim()}
                                    className="w-full bg-[#C8553D] hover:bg-[#A8442F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Проверка...
                                        </>
                                    ) : (
                                        "Сбросить пароль"
                                    )}
                                </button>
                            </form>

                            <Link
                                href="/admin/login"
                                className="block text-center text-[#8C8378] hover:text-white text-sm mt-4 transition"
                            >
                                ← Вернуться к входу
                            </Link>
                        </>
                    )}
                </div>

                <p className="text-center text-[#6B635C] text-xs mt-6">
                    Нива Сервис © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
