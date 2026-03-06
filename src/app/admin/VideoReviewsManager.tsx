"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Loader2, Video, Calendar, AlignLeft, Edit2, Check, X, ExternalLink } from "lucide-react";

interface VideoReview {
    id: number;
    videoUrl: string;
    description: string | null;
    reviewDate: string;
}

/** Извлекает ID Rutube-видео из URL */
function extractRutubeId(url: string): string | null {
    const m = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
    return m ? m[1] : null;
}

/** Извлекает ID YouTube-видео из URL */
function extractYoutubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

/** Определяет тип видеохостинга */
function detectPlatform(url: string): "rutube" | "youtube" | null {
    if (/rutube\.ru/.test(url)) return "rutube";
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    return null;
}

/** Возвращает embed URL */
function getEmbedUrl(url: string): string | null {
    const platform = detectPlatform(url);
    if (platform === "rutube") {
        const id = extractRutubeId(url);
        return id ? `https://rutube.ru/play/embed/${id}` : null;
    }
    if (platform === "youtube") {
        const id = extractYoutubeId(url);
        return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
}

/** Возвращает thumbnail URL (только для YouTube) */
function getThumbnailUrl(url: string): string | null {
    const id = extractYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

const inputCls = "w-full bg-white border-2 border-[#D1CBC3] text-[#1C1F23] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] transition-all placeholder:text-[#9C9488]";

export default function VideoReviewsManager() {
    const [reviews, setReviews] = useState<VideoReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState({ videoUrl: "", description: "", reviewDate: "" });
    const [editForm, setEditForm] = useState({ videoUrl: "", description: "", reviewDate: "" });
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
        if (!form.videoUrl || !form.reviewDate) {
            setError("Заполните ссылку на видео и дату отзыва");
            return;
        }
        const platform = detectPlatform(form.videoUrl);
        if (!platform) {
            setError("Некорректная ссылка. Принимаются ссылки Rutube или YouTube");
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
                setForm({ videoUrl: "", description: "", reviewDate: "" });
                loadReviews();
            }
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        setConfirmDeleteId(null);
        setDeletingId(id);
        await fetch(`/api/reviews/${id}`, { method: "DELETE" }).catch(() => { });
        setDeletingId(null);
        loadReviews();
    };

    const startEdit = (r: VideoReview) => {
        setEditId(r.id);
        setEditForm({ videoUrl: r.videoUrl, description: r.description ?? "", reviewDate: r.reviewDate });
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
                <Loader2 className="w-8 h-8 animate-spin text-[#C8553D]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl">

            {/* Add form */}
            <div className="bg-white border-2 border-[#D1CBC3] rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-[#1C1F23] text-base flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#C8553D]" /> Добавить отзыв
                </h3>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6B635C] flex items-center gap-1.5">
                        <Video className="w-5 h-5 text-[#C8553D]" /> Ссылка на видео (Rutube / YouTube) *
                    </label>
                    <input
                        type="url"
                        placeholder="https://rutube.ru/video/..."
                        value={form.videoUrl}
                        onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                        className={inputCls}
                    />
                    {form.videoUrl && detectPlatform(form.videoUrl) && (
                        <p className="text-xs text-emerald-600 font-medium">
                            ✓ Распознано: {detectPlatform(form.videoUrl) === "rutube" ? "Rutube" : "YouTube"}
                            {detectPlatform(form.videoUrl) === "rutube" && extractRutubeId(form.videoUrl)
                                ? ` · ID: ${extractRutubeId(form.videoUrl)}`
                                : ""}
                        </p>
                    )}
                    {form.videoUrl && !detectPlatform(form.videoUrl) && (
                        <p className="text-xs text-red-500 font-medium">⚠ Ссылка не распознана</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6B635C] flex items-center gap-1.5">
                        <AlignLeft className="w-5 h-5 text-[#9C9488]" /> Описание отзыва
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
                    <label className="text-sm font-bold text-[#6B635C] flex items-center gap-1.5">
                        <Calendar className="w-5 h-5 text-[#C8553D]" /> Дата отзыва *
                    </label>
                    <input
                        type="date"
                        value={form.reviewDate}
                        onChange={(e) => setForm((f) => ({ ...f, reviewDate: e.target.value }))}
                        className={inputCls}
                    />
                    <p className="text-xs text-[#9C9488]">Карточки сортируются от свежих к старым</p>
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {adding ? "Добавление…" : "Добавить отзыв"}
                </button>
            </div>

            {/* Reviews list */}
            <div className="space-y-3">
                <h3 className="font-bold text-[#6B635C] text-sm uppercase tracking-wider">
                    Отзывы ({reviews.length}) — сортировка по дате
                </h3>

                {reviews.length === 0 && (
                    <div className="bg-[#F0EDE8] border-2 border-dashed border-[#D1CBC3] rounded-2xl py-12 text-center text-[#9C9488]">
                        <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Нет добавленных отзывов</p>
                        <p className="text-sm">Добавьте первый отзыв с Rutube</p>
                    </div>
                )}

                {reviews.map((r) => {
                    const platform = detectPlatform(r.videoUrl);
                    const thumb = getThumbnailUrl(r.videoUrl);
                    const isEditing = editId === r.id;

                    return (
                        <div key={r.id} className="bg-white border-2 border-[#D1CBC3] rounded-2xl overflow-hidden">
                            <div className="flex gap-4 p-4">
                                {/* Thumbnail / Platform badge */}
                                {thumb ? (
                                    <img
                                        src={thumb}
                                        alt="Превью видео"
                                        className="w-32 h-20 object-cover rounded-xl shrink-0 bg-[#E6E2DC]"
                                    />
                                ) : (
                                    <div className="w-32 h-20 bg-[#E6E2DC] border-2 border-[#D1CBC3] rounded-xl shrink-0 flex flex-col items-center justify-center gap-1">
                                        <Video className="w-6 h-6 text-[#9C9488]" />
                                        {platform === "rutube" && (
                                            <span className="text-[10px] font-bold text-[#C8553D] uppercase">Rutube</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={editForm.videoUrl}
                                                onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value }))}
                                                className="w-full border-2 border-[#D1CBC3] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8553D] text-[#1C1F23]"
                                                placeholder="Rutube / YouTube URL"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                                className="w-full border-2 border-[#D1CBC3] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8553D] text-[#1C1F23]"
                                                placeholder="Описание"
                                            />
                                            <input
                                                type="date"
                                                value={editForm.reviewDate}
                                                onChange={(e) => setEditForm((f) => ({ ...f, reviewDate: e.target.value }))}
                                                className="border-2 border-[#D1CBC3] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8553D] text-[#1C1F23]"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveEdit(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg">
                                                    <Check className="w-3.5 h-3.5" /> Сохранить
                                                </button>
                                                <button onClick={() => setEditId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-[#E6E2DC] text-[#6B635C] text-sm font-bold rounded-lg">
                                                    <X className="w-3.5 h-3.5" /> Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs font-semibold text-[#C8553D] mb-0.5">
                                                📅 {fmtDate(r.reviewDate)}
                                                <span className="ml-2 text-[#9C9488] font-normal">
                                                    {platform === "rutube" ? "· Rutube" : platform === "youtube" ? "· YouTube" : ""}
                                                </span>
                                            </p>
                                            {r.description && (
                                                <p className="text-sm text-[#6B635C] leading-snug line-clamp-2">{r.description}</p>
                                            )}
                                            <a
                                                href={r.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#9C9488] hover:text-[#C8553D] transition-colors mt-1 flex items-center gap-1 truncate"
                                            >
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{r.videoUrl}</span>
                                            </a>
                                        </>
                                    )}
                                </div>

                                {!isEditing && (
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <button
                                            onClick={() => startEdit(r)}
                                            className="p-2 rounded-xl hover:bg-[#E6E2DC] text-[#9C9488] hover:text-[#1C1F23] transition"
                                            title="Редактировать"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {confirmDeleteId === r.id ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-red-500 font-medium">Удалить?</span>
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    disabled={deletingId === r.id}
                                                    className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                                                    title="Да, удалить"
                                                >
                                                    {deletingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="p-1.5 rounded-lg bg-[#E6E2DC] text-[#6B635C] hover:bg-[#D1CBC3] transition"
                                                    title="Отмена"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmDeleteId(r.id)}
                                                disabled={deletingId === r.id}
                                                className="p-2 rounded-xl hover:bg-red-50 text-[#D1CBC3] hover:text-red-500 transition disabled:opacity-50"
                                                title="Удалить"
                                            >
                                                {deletingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        )}
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
