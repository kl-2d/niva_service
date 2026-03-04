"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Loader2, Youtube, Calendar, AlignLeft, Edit2, Check, X } from "lucide-react";

interface VideoReview {
    id: number;
    youtubeUrl: string;
    description: string | null;
    reviewDate: string;
}

function extractYoutubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

const inputCls = "w-full bg-white border-2 border-stone-300 text-stone-900 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-400";

export default function VideoReviewsManager() {
    const [reviews, setReviews] = useState<VideoReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [form, setForm] = useState({ youtubeUrl: "", description: "", reviewDate: "" });
    const [editForm, setEditForm] = useState({ youtubeUrl: "", description: "", reviewDate: "" });
    const [error, setError] = useState<string | null>(null);

    const loadReviews = () => {
        setLoading(true);
        fetch("/api/reviews")
            .then((r) => r.json())
            .then(setReviews)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(loadReviews, []);

    const handleAdd = async () => {
        setError(null);
        if (!form.youtubeUrl || !form.reviewDate) {
            setError("Заполните ссылку на видео и дату отзыва");
            return;
        }
        if (!extractYoutubeId(form.youtubeUrl)) {
            setError("Некорректная ссылка YouTube");
            return;
        }
        setAdding(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || "Ошибка");
            } else {
                setForm({ youtubeUrl: "", description: "", reviewDate: "" });
                loadReviews();
            }
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Удалить этот отзыв?")) return;
        setDeletingId(id);
        await fetch(`/api/reviews/${id}`, { method: "DELETE" }).catch(() => { });
        setDeletingId(null);
        loadReviews();
    };

    const startEdit = (r: VideoReview) => {
        setEditId(r.id);
        setEditForm({ youtubeUrl: r.youtubeUrl, description: r.description ?? "", reviewDate: r.reviewDate });
    };

    const handleSaveEdit = async (id: number) => {
        await fetch(`/api/reviews/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        setEditId(null);
        loadReviews();
    };

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#E07B00]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl">

            {/* Add form */}
            <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#E07B00]" /> Добавить отзыв
                </h3>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                        <Youtube className="w-4 h-4 text-red-500" /> Ссылка на YouTube *
                    </label>
                    <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={form.youtubeUrl}
                        onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                        className={inputCls}
                    />
                    {form.youtubeUrl && extractYoutubeId(form.youtubeUrl) && (
                        <p className="text-xs text-emerald-600 font-medium">✓ Видео определено: {extractYoutubeId(form.youtubeUrl)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                        <AlignLeft className="w-4 h-4 text-stone-400" /> Описание отзыва
                    </label>
                    <textarea
                        placeholder='Пример: "Отзыв от Ивана, владельца ВАЗ-21214, наш клиент с 2015 года"'
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className={`${inputCls} resize-none`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#E07B00]" /> Дата отзыва *
                    </label>
                    <input
                        type="date"
                        value={form.reviewDate}
                        onChange={(e) => setForm((f) => ({ ...f, reviewDate: e.target.value }))}
                        className={inputCls}
                    />
                    <p className="text-xs text-stone-400">Карточки сортируются от ранней к актуальной дате</p>
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex items-center gap-2 px-6 py-3 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold rounded-xl transition-all disabled:opacity-60"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {adding ? "Добавление…" : "Добавить отзыв"}
                </button>
            </div>

            {/* Reviews list */}
            <div className="space-y-3">
                <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wider">
                    Отзывы ({reviews.length}) — сортировка по дате
                </h3>

                {reviews.length === 0 && (
                    <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl py-12 text-center text-stone-400">
                        <Youtube className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Нет добавленных отзывов</p>
                        <p className="text-sm">Добавьте первый отзыв с YouTube</p>
                    </div>
                )}

                {reviews.map((r) => {
                    const vidId = extractYoutubeId(r.youtubeUrl);
                    const isEditing = editId === r.id;

                    return (
                        <div key={r.id} className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden">
                            <div className="flex gap-4 p-4">
                                {/* Thumbnail */}
                                {vidId ? (
                                    <img
                                        src={`https://img.youtube.com/vi/${vidId}/mqdefault.jpg`}
                                        alt="Превью видео"
                                        className="w-32 h-20 object-cover rounded-xl shrink-0 bg-stone-200"
                                    />
                                ) : (
                                    <div className="w-32 h-20 bg-stone-200 rounded-xl shrink-0 flex items-center justify-center">
                                        <Youtube className="w-6 h-6 text-stone-400" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={editForm.youtubeUrl}
                                                onChange={(e) => setEditForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                                                className="w-full border-2 border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#E07B00]"
                                                placeholder="YouTube URL"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                                className="w-full border-2 border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#E07B00]"
                                                placeholder="Описание"
                                            />
                                            <input
                                                type="date"
                                                value={editForm.reviewDate}
                                                onChange={(e) => setEditForm((f) => ({ ...f, reviewDate: e.target.value }))}
                                                className="border-2 border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#E07B00]"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveEdit(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg">
                                                    <Check className="w-3.5 h-3.5" /> Сохранить
                                                </button>
                                                <button onClick={() => setEditId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-stone-200 text-stone-700 text-sm font-bold rounded-lg">
                                                    <X className="w-3.5 h-3.5" /> Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs font-semibold text-[#E07B00] mb-0.5">
                                                📅 {fmtDate(r.reviewDate)}
                                            </p>
                                            {r.description && (
                                                <p className="text-sm text-stone-700 leading-snug line-clamp-2">{r.description}</p>
                                            )}
                                            <p className="text-xs text-stone-400 mt-1 truncate">{r.youtubeUrl}</p>
                                        </>
                                    )}
                                </div>

                                {!isEditing && (
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <button
                                            onClick={() => startEdit(r)}
                                            className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
                                            title="Редактировать"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            disabled={deletingId === r.id}
                                            className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition disabled:opacity-50"
                                            title="Удалить"
                                        >
                                            {deletingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
