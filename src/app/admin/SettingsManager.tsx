"use client";

import { useState, useEffect, FormEvent } from "react";
import { Mail, X, Plus, Loader2, Check, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function SettingsManager() {
    // ── Email state ────────────────────────────────────────────────────────────
    const [emails, setEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(true);
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    // ── Password state ─────────────────────────────────────────────────────────
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    // ── Load emails on mount ───────────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/admin/settings")
            .then((r) => r.json())
            .then((d) => {
                if (d.emails) setEmails(d.emails);
            })
            .catch(() => { })
            .finally(() => setEmailLoading(false));
    }, []);

    // ── Email handlers ─────────────────────────────────────────────────────────
    function addEmail() {
        const trimmed = newEmail.trim().toLowerCase();
        if (!trimmed) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setEmailMsg({ type: "err", text: "Некорректный формат email" });
            return;
        }
        if (emails.includes(trimmed)) {
            setEmailMsg({ type: "err", text: "Этот email уже добавлен" });
            return;
        }
        setEmails((prev) => [...prev, trimmed]);
        setNewEmail("");
        setEmailMsg(null);
    }

    function removeEmail(email: string) {
        setEmails((prev) => prev.filter((e) => e !== email));
    }

    async function saveEmails() {
        setEmailSaving(true);
        setEmailMsg(null);

        // Auto-add pending email from input (user may skip clicking +)
        let toSave = [...emails];
        const pending = newEmail.trim().toLowerCase();
        if (pending && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pending) && !toSave.includes(pending)) {
            toSave = [...toSave, pending];
            setEmails(toSave);
            setNewEmail("");
        }

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emails: toSave }),
            });
            const data = await res.json();
            if (res.ok) {
                setEmailMsg({ type: "ok", text: "Email-адреса сохранены" });
            } else {
                setEmailMsg({ type: "err", text: data.error || "Ошибка сохранения" });
            }
        } catch {
            setEmailMsg({ type: "err", text: "Ошибка сети" });
        } finally {
            setEmailSaving(false);
        }
    }

    // ── Password handler ───────────────────────────────────────────────────────
    async function handlePasswordChange(e: FormEvent) {
        e.preventDefault();
        setPwMsg(null);

        if (newPassword.length < 4) {
            setPwMsg({ type: "err", text: "Минимум 4 символа" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwMsg({ type: "err", text: "Пароли не совпадают" });
            return;
        }

        setPwSaving(true);
        try {
            const res = await fetch("/api/admin/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setPwMsg({ type: "ok", text: "Пароль успешно изменён" });
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPwMsg({ type: "err", text: data.error || "Ошибка смены пароля" });
            }
        } catch {
            setPwMsg({ type: "err", text: "Ошибка сети" });
        } finally {
            setPwSaving(false);
        }
    }

    // ── Styles ─────────────────────────────────────────────────────────────────
    const cardCls =
        "bg-white rounded-2xl border-2 border-[#D1CBC3] shadow-sm p-6";
    const labelCls =
        "block text-xs font-semibold text-[#6B635C] uppercase tracking-wider mb-1.5";
    const inputCls =
        "w-full bg-[#F0EDE8] border-2 border-[#D1CBC3] rounded-xl px-4 py-3 text-[#1C1F23] placeholder-[#9C9488] focus:outline-none focus:border-[#C8553D] focus:ring-1 focus:ring-[#C8553D] transition text-sm";
    const btnPrimary =
        "bg-[#C8553D] hover:bg-[#A8442F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm";

    return (
        <div className="space-y-8">
            {/* ── Email Notifications ────────────────────────────────────────────── */}
            <div className={cardCls}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-[#FAE8E4] text-[#C8553D] p-3 rounded-xl border border-[#E8C5B8]">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1C1F23] text-base">
                            Email-уведомления
                        </h3>
                        <p className="text-[#9C9488] text-sm">
                            Адреса для получения заявок с сайта
                        </p>
                    </div>
                </div>

                {emailLoading ? (
                    <div className="flex items-center gap-2 text-[#9C9488] py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Загрузка...
                    </div>
                ) : (
                    <>
                        {/* Email chips */}
                        {emails.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {emails.map((email) => (
                                    <span
                                        key={email}
                                        className="inline-flex items-center gap-1.5 bg-[#E6E2DC] text-[#1C1F23] text-sm font-medium px-3 py-2 rounded-xl border border-[#D1CBC3]"
                                    >
                                        {email}
                                        <button
                                            onClick={() => removeEmail(email)}
                                            className="text-[#9C9488] hover:text-red-500 transition p-0.5 rounded-lg hover:bg-red-50"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {emails.length === 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                Нет email-адресов. Уведомления не будут отправляться!
                            </div>
                        )}

                        {/* Add input */}
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setEmailMsg(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addEmail();
                                    }
                                }}
                                placeholder="email@example.com"
                                className={`${inputCls} flex-1`}
                            />
                            <button
                                onClick={addEmail}
                                disabled={!newEmail.trim()}
                                className="bg-[#E6E2DC] hover:bg-[#D1CBC3] disabled:opacity-50 text-[#1C1F23] font-bold p-3 rounded-xl transition border-2 border-[#D1CBC3]"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Message */}
                        {emailMsg && (
                            <div
                                className={`mt-3 text-sm px-4 py-2.5 rounded-xl ${emailMsg.type === "ok"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : "bg-red-50 border border-red-200 text-red-600"
                                    }`}
                            >
                                {emailMsg.text}
                            </div>
                        )}

                        {/* Save button */}
                        <button
                            onClick={saveEmails}
                            disabled={emailSaving}
                            className={`${btnPrimary} mt-4`}
                        >
                            {emailSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Сохранение...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Сохранить
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* ── Password Change ────────────────────────────────────────────────── */}
            <div className={cardCls}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-[#E6E2DC] text-[#6B635C] p-3 rounded-xl border border-[#D1CBC3]">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1C1F23] text-base">
                            Смена пароля
                        </h3>
                        <p className="text-[#9C9488] text-sm">
                            Для входа в панель управления
                        </p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    {/* Old password */}
                    <div>
                        <label className={labelCls}>Текущий пароль</label>
                        <div className="relative">
                            <input
                                type={showOld ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                disabled={pwSaving}
                                className={`${inputCls} pr-12`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9488] hover:text-[#6B635C] transition"
                                tabIndex={-1}
                            >
                                {showOld ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New password */}
                    <div>
                        <label className={labelCls}>Новый пароль</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={pwSaving}
                                className={`${inputCls} pr-12`}
                                placeholder="Минимум 4 символа"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9488] hover:text-[#6B635C] transition"
                                tabIndex={-1}
                            >
                                {showNew ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label className={labelCls}>Подтверждение пароля</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={pwSaving}
                            className={inputCls}
                            placeholder="Повторите новый пароль"
                        />
                    </div>

                    {/* Message */}
                    {pwMsg && (
                        <div
                            className={`text-sm px-4 py-2.5 rounded-xl ${pwMsg.type === "ok"
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                : "bg-red-50 border border-red-200 text-red-600"
                                }`}
                        >
                            {pwMsg.text}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={pwSaving || !oldPassword || !newPassword || !confirmPassword}
                        className={btnPrimary}
                    >
                        {pwSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Сменить пароль
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
