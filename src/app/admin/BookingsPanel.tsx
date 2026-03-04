"use client";

import { useState } from "react";
import { Phone, Trash2, ChevronDown, Car, CalendarDays, Wrench, ArrowUpDown } from "lucide-react";

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
    if (!confirm("Удалить заявку? Это действие необратимо.")) return;
    if (pendingId !== null) return;
    setPendingId(id);
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
      {/* Filter + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-3 rounded-xl text-base font-bold border transition-all ${filter === f.id
                ? "bg-[#E07B00] text-white border-[#E07B00] shadow-sm"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
            >
              {f.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-bold ${filter === f.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-5 h-5 text-stone-400" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-base border-2 border-stone-200 rounded-xl px-4 py-3 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] font-medium"
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
          <div className="bg-white rounded-2xl border-2 border-stone-200 p-14 text-center text-stone-400 text-lg">
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
                b.status === "IN_PROGRESS" ? "border-blue-200" : "border-stone-200"
                }`}
            >
              {/* Card body */}
              <div className="p-5 sm:p-6 space-y-4">

                {/* ── Row 1: identity + contact fields ── */}
                <div className="flex flex-wrap items-start gap-x-8 gap-y-4">

                  {/* Name + status badge + promo badge */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <div className="font-black text-stone-900 text-lg leading-tight">{b.name}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`self-start text-sm px-3 py-1 rounded-full font-bold border ${meta.cls}`}>
                        {meta.label}
                      </span>
                      {promoName && (
                        <span className="self-start inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-bold bg-[#E07B00]/10 text-[#E07B00] border border-[#E07B00]/30">
                          🎯 По акции: {promoName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Телефон */}
                  <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Телефон</div>
                    <a
                      href={`tel:${b.phone.replace(/\D/g, "")}`}
                      className="text-base font-bold text-[#E07B00] hover:text-[#B86300] transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {b.phone}
                    </a>
                  </div>

                  {/* Машина */}
                  <div className="flex flex-col gap-1 min-w-[130px]">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Машина</div>
                    <div className="text-base text-stone-800 font-semibold flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-stone-400 shrink-0" />
                      {b.carBrand || <span className="text-stone-300 font-normal">—</span>}
                    </div>
                  </div>

                  {/* Госномер */}
                  <div className="flex flex-col gap-1 min-w-[130px]">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Госномер</div>
                    <div className="text-base font-mono font-bold text-stone-800 tracking-widest uppercase">
                      {b.carPlate || <span className="text-stone-300 font-normal font-sans tracking-normal">—</span>}
                    </div>
                  </div>
                </div>

                {/* ── Row 2: dates + price + actions ── */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-3 border-t border-stone-100">

                  {/* Дата заказа */}
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Дата заказа</div>
                    <div className="text-base text-stone-700 font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-stone-400 shrink-0" />
                      {new Date(b.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Желаемая дата */}
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Желаемая дата</div>
                    <div className="text-base text-stone-700 font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-stone-400 shrink-0" />
                      {b.date
                        ? new Date(b.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
                        : <span className="text-stone-300">не указана</span>
                      }
                    </div>
                  </div>

                  {/* Push price + actions to the right */}
                  <div className="flex-1" />

                  {/* Callback badge OR price */}
                  {isCallback && b.status !== "DONE" ? (
                    <span className="relative flex items-center gap-2 text-base font-bold text-amber-700 bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2.5 whitespace-nowrap">
                      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                      📞 Ждёт звонка
                    </span>
                  ) : !isCallback ? (
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black font-mono text-stone-900 whitespace-nowrap">{b.totalPrice.toLocaleString("ru-RU")} ₽</div>
                      <div className="text-sm text-stone-400">{parsedServices.length} {parsedServices.length === 1 ? "услуга" : parsedServices.length < 5 ? "услуги" : "услуг"}</div>
                    </div>
                  ) : null}

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
                    className="p-3 rounded-xl hover:bg-stone-100 text-stone-400 transition shrink-0 border-2 border-stone-200"
                    title="Показать услуги"
                  >
                    <ChevronDown className={`w-6 h-6 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteBooking(b.id)}
                    disabled={pendingId === b.id}
                    className="p-3 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition shrink-0 disabled:opacity-50 disabled:cursor-wait border-2 border-stone-200 hover:border-red-200"
                    title="Удалить заявку"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Expanded: services list */}
              {isExpanded && (
                <div className="border-t-2 border-stone-100 px-6 py-5 bg-stone-50 rounded-b-2xl">
                  <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Выбранные услуги
                  </h4>
                  {parsedServices.length > 0 ? (
                    <ul className="space-y-3">
                      {parsedServices.map((s, i) => (
                        <li key={i} className="flex justify-between items-center text-base border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                          <span className="text-stone-700 font-medium">{s.title}</span>
                          <span className="font-mono font-bold text-stone-900 text-lg">{s.price?.toLocaleString("ru-RU")} ₽</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-400 text-base">{b.services}</p>
                  )}
                  {cleanComment && (
                    <div className="mt-5 pt-4 border-t border-stone-200">
                      <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">💬 Комментарий клиента</h4>
                      <p className="text-base text-stone-700 bg-white border-2 border-stone-200 rounded-xl px-5 py-4 leading-relaxed">{cleanComment}</p>
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
