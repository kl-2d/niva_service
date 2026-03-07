"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Phone, Trash2, ChevronDown, Car, CalendarDays, Wrench, ArrowUpDown, Bell } from "lucide-react";

interface Booking {
  id: number;
  createdAt: string;
  name: string;
  phone: string;
  date: string | null;
  services: string;
  totalPrice: number;
  status: string;
  carBrand: string | null;
  carPlate: string | null;
  comment: string | null;
}

const STATUS_META: Record<string, { label: string; cls: string; next: string }> = {
  NEW: { label: "Новая", cls: "bg-amber-100 text-amber-800 border-amber-200", next: "Взять в работу" },
  IN_PROGRESS: { label: "В работе", cls: "bg-blue-100 text-blue-800 border-blue-200", next: "Отметить выполненным" },
  DONE: { label: "Выполнено", cls: "bg-emerald-100 text-emerald-800 border-emerald-200", next: "Вернуть в новые" },
};

type Filter = "ALL" | "NEW" | "IN_PROGRESS" | "DONE";
type SortKey = "date_desc" | "date_asc" | "price_desc" | "price_asc";

export default function BookingsPanel({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [newToast, setNewToast] = useState<Booking | null>(null);
  const knownIds = useRef<Set<number>>(new Set(initialBookings.map(b => b.id)));
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Play a pleasant 3-note chime (C5→E5→G5) — soft messenger-like notification */
  const playDing = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const master = ctx.createGain();
      master.connect(ctx.destination);
      master.gain.setValueAtTime(0.25, ctx.currentTime);

      // Three ascending notes: C5 (523), E5 (659), G5 (784)
      const notes = [523, 659, 784];
      const noteSpacing = 0.22;
      const noteDuration = 0.6;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(master);

        const start = ctx.currentTime + i * noteSpacing;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.5, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);

        osc.start(start);
        osc.stop(start + noteDuration);
      });

      const totalDuration = notes.length * noteSpacing + noteDuration;
      setTimeout(() => ctx.close(), (totalDuration + 0.2) * 1000);
    } catch { /* AudioContext not available */ }
  }, []);

  /** Poll GET /api/bookings every 15 s */
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/bookings", { cache: "no-store" });
        if (!res.ok) return;
        const fresh: Booking[] = await res.json();

        // Find truly new entries
        const newOnes = fresh.filter(b => !knownIds.current.has(b.id));
        if (newOnes.length > 0) {
          newOnes.forEach(b => knownIds.current.add(b.id));
          setBookings(fresh);
          // Show toast for the most recent
          const newest = newOnes[0];
          setNewToast(newest);
          playDing();
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(() => setNewToast(null), 8000);
        }
      } catch { /* network error, silently ignore */ }
    };

    const interval = setInterval(poll, 15_000);
    return () => { clearInterval(interval); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [playDing]);

  const filtered = (() => {
    const base = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
    return [...base].sort((a, b) => {
      if (sort === "date_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "date_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "price_desc") return b.totalPrice - a.totalPrice;
      if (sort === "price_asc") return a.totalPrice - b.totalPrice;
      return 0;
    });
  })();

  const cycleStatus = async (id: number) => {
    if (pendingId !== null) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: updated.status } : b));
      }
    } finally {
      setPendingId(null);
    }
  };

  const deleteBooking = async (id: number) => {
    if (pendingId !== null) return;
    setPendingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) setBookings(prev => prev.filter(b => b.id !== id));
    } finally {
      setPendingId(null);
    }
  };

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "ALL", label: "Все", count: bookings.length },
    { id: "NEW", label: "Новые", count: bookings.filter(b => b.status === "NEW").length },
    { id: "IN_PROGRESS", label: "В работе", count: bookings.filter(b => b.status === "IN_PROGRESS").length },
    { id: "DONE", label: "Выполнено", count: bookings.filter(b => b.status === "DONE").length },
  ];

  return (
    <div className="space-y-5">

      {/* ── New booking toast ── */}
      {newToast && (
        <div className="fixed top-5 right-5 z-[100] w-80 animate-slide-in-right">
          <div className="relative bg-white border-2 border-[#C8553D] rounded-2xl shadow-2xl shadow-[#C8553D]/20 overflow-hidden">
            {/* Top bar */}
            <div className="h-1 bg-gradient-to-r from-[#C8553D] to-[#E8A88C] w-full" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8553D] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[#1C1F23] mb-0.5">🎉 Новая заявка!</p>
                  <p className="text-base font-bold text-[#1C1F23] truncate">{newToast.name}</p>
                  <a
                    href={`tel:${newToast.phone.replace(/\D/g, "")}`}
                    className="text-sm text-[#C8553D] font-bold hover:text-[#A8442F] transition-colors"
                  >
                    {newToast.phone}
                  </a>
                  {/* Promo tag */}
                  {newToast.comment?.includes("[Перешёл по акции:") && (
                    <p className="text-xs text-[#C8553D] font-bold mt-1">🎯 По акции</p>
                  )}
                </div>
                <button
                  onClick={() => setNewToast(null)}
                  className="text-[#D1CBC3] hover:text-[#1C1F23] transition-colors shrink-0 mt-0.5"
                >
                  ✕
                </button>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1 bg-[#E6E2DC] rounded-full overflow-hidden">
                <div className="h-full bg-[#C8553D] rounded-full animate-shrink-width" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Filter + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-3 rounded-xl text-base font-bold border transition-all ${filter === f.id
                ? "bg-[#C8553D] text-white border-[#C8553D] shadow-sm"
                : "bg-white text-[#6B635C] border-[#D1CBC3] hover:border-[#C8553D]/40"
                }`}
            >
              {f.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-bold ${filter === f.id ? "bg-white/20 text-white" : "bg-[#E6E2DC] text-[#6B635C]"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-5 h-5 text-[#9C9488]" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-base border-2 border-[#D1CBC3] rounded-xl px-4 py-3 bg-white text-[#1C1F23] focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] font-medium"
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="price_desc">Сумма: по убыванию</option>
            <option value="price_asc">Сумма: по возрастанию</option>
          </select>
        </div>
      </div>

      {/* Booking cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#D1CBC3] p-14 text-center text-[#9C9488] text-lg">
            Заявок в этой категории нет
          </div>
        )}

        {filtered.map(b => {
          const meta = STATUS_META[b.status] ?? STATUS_META["NEW"];
          const isExpanded = expanded === b.id;

          let parsedServices: { title: string; price: number }[] = [];
          try {
            const p = JSON.parse(b.services);
            parsedServices = Array.isArray(p) ? p : [];
          } catch { }

          const isCallback = parsedServices.length === 0 || b.totalPrice === 0;

          // Извлекаем метку акции из комментария
          const promoMatch = b.comment?.match(/^\[Перешёл по акции: «(.+?)»\]/);
          const promoName = promoMatch ? promoMatch[1] : null;
          // Комментарий без метки акции
          const cleanComment = b.comment?.replace(/^\[Перешёл по акции: «.+?»\](\n\n)?/, "").trim() || null;

          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl border shadow-sm transition-all ${b.status === "NEW" ? "border-amber-200" :
                b.status === "IN_PROGRESS" ? "border-blue-200" : "border-[#D1CBC3]"
                }`}
            >
              {/* Card body */}
              <div className="p-5 sm:p-6 space-y-4">

                {/* ── Row 1: identity + contact fields ── */}
                <div className="flex flex-wrap items-start gap-x-8 gap-y-4">

                  {/* Name + status badge + promo badge */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <div className="font-black text-[#1C1F23] text-lg leading-tight">{b.name}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`self-start text-sm px-3 py-1 rounded-full font-bold border ${meta.cls}`}>
                        {meta.label}
                      </span>
                      {promoName && (
                        <span className="self-start inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-bold bg-[#FAE8E4] text-[#C8553D] border border-[#C8553D]/30">
                          🎯 По акции: {promoName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Телефон */}
                  <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Телефон</div>
                    <a
                      href={`tel:${b.phone.replace(/\D/g, "")}`}
                      className="text-base font-bold text-[#C8553D] hover:text-[#A8442F] transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {b.phone}
                    </a>
                  </div>

                  {/* Машина */}
                  <div className="flex flex-col gap-1 min-w-[130px]">
                    <div className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Машина</div>
                    <div className="text-base text-[#1C1F23] font-semibold flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#9C9488] shrink-0" />
                      {b.carBrand || <span className="text-[#D1CBC3] font-normal">—</span>}
                    </div>
                  </div>

                  {/* Госномер */}
                  <div className="flex flex-col gap-1 min-w-[130px]">
                    <div className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Госномер</div>
                    <div className="text-base font-bold text-[#1C1F23] tracking-widest uppercase" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>
                      {b.carPlate || <span className="text-[#D1CBC3] font-normal tracking-normal" style={{ fontFamily: "inherit" }}>—</span>}
                    </div>
                  </div>
                </div>

                {/* ── Row 2: dates + price + actions ── */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-3 border-t border-[#E6E2DC]">

                  {/* Дата заказа */}
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <div className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Дата заказа</div>
                    <div className="text-base text-[#6B635C] font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-[#9C9488] shrink-0" />
                      {new Date(b.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Желаемая дата */}
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <div className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Желаемая дата</div>
                    <div className="text-base text-[#6B635C] font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-[#9C9488] shrink-0" />
                      {b.date
                        ? new Date(b.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
                        : <span className="text-[#D1CBC3]">не указана</span>
                      }
                    </div>
                  </div>

                  {/* Push price + actions to the right */}
                  <div className="flex-1" />

                  {/* Callback badge — informational, left of actions */}
                  {isCallback && b.status !== "DONE" && (
                    <span className="relative flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 whitespace-nowrap select-none">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                      📞 Ждёт звонка
                    </span>
                  )}

                  {/* Price (non-callback bookings) */}
                  {!isCallback && (
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-[#1C1F23] whitespace-nowrap" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{b.totalPrice.toLocaleString("ru-RU")} ₽</div>
                      <div className="text-sm text-[#9C9488]">{parsedServices.length} {parsedServices.length === 1 ? "услуга" : parsedServices.length < 5 ? "услуги" : "услуг"}</div>
                    </div>
                  )}

                  {/* Status cycle button */}
                  <button
                    onClick={() => cycleStatus(b.id)}
                    disabled={pendingId === b.id}
                    title={meta.next}
                    className={`px-5 py-3 rounded-xl text-base font-bold border-2 transition-all hover:opacity-80 whitespace-nowrap shrink-0 ${meta.cls} disabled:opacity-50 disabled:cursor-wait`}
                  >
                    {pendingId === b.id ? "…" : meta.next}
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : b.id)}
                    className="p-3 rounded-xl hover:bg-[#E6E2DC] text-[#9C9488] transition shrink-0 border-2 border-[#D1CBC3]"
                    title="Показать услуги"
                  >
                    <ChevronDown className={`w-6 h-6 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Delete — inline confirm */}
                  {confirmDeleteId === b.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-red-600 font-bold whitespace-nowrap">Удалить?</span>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        disabled={pendingId === b.id}
                        className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition disabled:opacity-50"
                      >
                        Да
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-2 rounded-lg bg-[#E6E2DC] hover:bg-[#D1CBC3] text-[#6B635C] text-sm font-bold transition"
                      >
                        Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(b.id)}
                      disabled={pendingId === b.id}
                      className="p-3 rounded-xl hover:bg-red-50 text-[#D1CBC3] hover:text-red-500 transition shrink-0 disabled:opacity-50 disabled:cursor-wait border-2 border-[#D1CBC3] hover:border-red-200"
                      title="Удалить заявку"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded: services list */}
              {isExpanded && (
                <div className="border-t-2 border-[#E6E2DC] px-6 py-5 bg-[#F0EDE8] rounded-b-2xl">
                  <h4 className="text-sm font-bold text-[#6B635C] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Выбранные услуги
                  </h4>
                  {parsedServices.length > 0 ? (
                    <ul className="space-y-3">
                      {parsedServices.map((s, i) => (
                        <li key={i} className="flex justify-between items-center text-base border-b border-[#DDD8D1] pb-2 last:border-0 last:pb-0">
                          <span className="text-[#6B635C] font-medium">{s.title}</span>
                          <span className="font-bold text-[#1C1F23] text-lg" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{s.price?.toLocaleString("ru-RU")} ₽</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#9C9488] text-base">{b.services}</p>
                  )}
                  {cleanComment && (
                    <div className="mt-5 pt-4 border-t border-[#D1CBC3]">
                      <h4 className="text-sm font-bold text-[#6B635C] uppercase tracking-wider mb-3">💬 Комментарий клиента</h4>
                      <p className="text-base text-[#6B635C] bg-white border-2 border-[#D1CBC3] rounded-xl px-5 py-4 leading-relaxed">{cleanComment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
