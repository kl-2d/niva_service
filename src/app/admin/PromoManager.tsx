"use client";

import { useState, useEffect } from "react";
import { Zap, Calendar, Save, Loader2, Check, ToggleLeft, ToggleRight } from "lucide-react";

interface PromoData {
    title: string;
    description: string;
    isActive: boolean;
    eventDateStart: string;
    eventDate: string;
}

export default function PromoManager() {
    const [form, setForm] = useState<PromoData>({
        title: "Бесплатная диагностика",
        description: "Запишитесь на бесплатный комплексный осмотр вашего автомобиля",
        isActive: false,
        eventDateStart: "",
        eventDate: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/promo")
            .then((r) => r.json())
            .then((data) => {
                if (data) {
                    setForm({
                        title: data.title ?? "",
                        description: data.description ?? "",
                        isActive: data.isActive ?? false,
                        eventDateStart: data.eventDateStart ?? "",
                        eventDate: data.eventDate ?? "",
                    });
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/promo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full bg-white border-2 border-stone-300 text-stone-900 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-400";

    // Проверяем актуальность дат
    const today = new Date().toISOString().slice(0, 10);
    const isExpired = form.eventDate && today > form.eventDate;
    const notStarted = form.eventDateStart && today < form.eventDateStart;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#E07B00]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">

            {/* Status card */}
            <div className={`rounded-2xl border-2 p-6 flex items-center justify-between gap-4 transition-all ${form.isActive && !isExpired
                    ? "border-[#E07B00]/40 bg-orange-50"
                    : "border-stone-200 bg-stone-50"
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${form.isActive && !isExpired ? "bg-[#E07B00]/10" : "bg-stone-200"
                        }`}>
                        <Zap className={`w-6 h-6 ${form.isActive && !isExpired ? "text-[#E07B00]" : "text-stone-400"}`} />
                    </div>
                    <div>
                        <p className="font-bold text-stone-900 text-lg">
                            {!form.isActive
                                ? "Акция не активна"
                                : isExpired
                                    ? "⚠️ Срок акции истёк (авто-отключена)"
                                    : notStarted
                                        ? "⏳ Акция ещё не началась"
                                        : "✅ Акция активна"}
                        </p>
                        <p className="text-stone-500 text-sm">
                            {form.isActive && !isExpired && !notStarted
                                ? "Плашка отображается в шапке сайта"
                                : "Плашка скрыта от посетителей"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                    className="shrink-0 flex items-center gap-2 font-bold text-sm"
                    title={form.isActive ? "Выключить акцию" : "Включить акцию"}
                >
                    {form.isActive
                        ? <ToggleRight className="w-10 h-10 text-[#E07B00]" />
                        : <ToggleLeft className="w-10 h-10 text-stone-400" />
                    }
                    <span className={form.isActive ? "text-[#E07B00]" : "text-stone-500"}>
                        {form.isActive ? "Вкл" : "Выкл"}
                    </span>
                </button>
            </div>

            {/* Form */}
            <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-stone-900 text-lg">Настройки акции</h3>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 block">Название акции *</label>
                    <input
                        type="text"
                        placeholder="Бесплатная диагностика"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className={inputCls}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 block">Описание акции</label>
                    <textarea
                        placeholder="Краткое описание для посетителей..."
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={3}
                        className={`${inputCls} resize-none`}
                    />
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-stone-700 block flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#E07B00]" /> Дата начала
                        </label>
                        <input
                            type="date"
                            value={form.eventDateStart}
                            onChange={(e) => setForm((f) => ({ ...f, eventDateStart: e.target.value }))}
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-stone-700 block flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-stone-400" /> Дата окончания
                        </label>
                        <input
                            type="date"
                            value={form.eventDate}
                            min={form.eventDateStart || undefined}
                            onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                            className={inputCls}
                        />
                    </div>
                </div>

                {/* Date preview */}
                {(form.eventDateStart || form.eventDate) && (
                    <p className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5">
                        📅 Акция действует:{" "}
                        <b>{form.eventDateStart
                            ? new Date(form.eventDateStart).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
                            : "—"}</b>
                        {" "} — {" "}
                        <b>{form.eventDate
                            ? new Date(form.eventDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
                            : "—"}</b>
                        {isExpired && <span className="ml-2 text-red-500 font-medium">(срок истёк)</span>}
                    </p>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all ${saved ? "bg-emerald-600 text-white" : "bg-[#E07B00] hover:bg-[#B86300] text-white"
                        } disabled:opacity-70`}
                >
                    {saving ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Сохранение…</>
                    ) : saved ? (
                        <><Check className="w-5 h-5" /> Сохранено!</>
                    ) : (
                        <><Save className="w-5 h-5" /> Сохранить настройки</>
                    )}
                </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-stone-600">
                💡 По истечении даты окончания акция <b>автоматически отключается</b> и перестаёт показываться на сайте.
            </div>
        </div>
    );
}
