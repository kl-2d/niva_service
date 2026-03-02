"use client";

import { useState, useTransition } from "react";
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
}

const STATUS_META: Record<string, { label: string; cls: string; next: string }> = {
  NEW:         { label: "Новая",     cls: "bg-amber-100 text-amber-800 border-amber-200",   next: "Взять в работу" },
  IN_PROGRESS: { label: "В работе", cls: "bg-blue-100 text-blue-800 border-blue-200",      next: "Отметить выполненным" },
  DONE:        { label: "Выполнено",cls: "bg-emerald-100 text-emerald-800 border-emerald-200", next: "Вернуть в новые" },
};

type Filter = "ALL" | "NEW" | "IN_PROGRESS" | "DONE";
type SortKey = "date_desc" | "date_asc" | "price_desc" | "price_asc";

export default function BookingsPanel({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = (() => {
    const base = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
    return [...base].sort((a, b) => {
      if (sort === "date_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "date_asc")  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "price_desc") return b.totalPrice - a.totalPrice;
      if (sort === "price_asc")  return a.totalPrice - b.totalPrice;
      return 0;
    });
  })();

  const cycleStatus = (id: number) => {
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: updated.status } : b));
      }
    });
  };

  const deleteBooking = (id: number) => {
    if (!confirm("Удалить заявку? Это действие необратимо.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) setBookings(prev => prev.filter(b => b.id !== id));
    });
  };

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "ALL",         label: "Все",        count: bookings.length },
    { id: "NEW",         label: "Новые",      count: bookings.filter(b=>b.status==="NEW").length },
    { id: "IN_PROGRESS", label: "В работе",   count: bookings.filter(b=>b.status==="IN_PROGRESS").length },
    { id: "DONE",        label: "Выполнено",  count: bookings.filter(b=>b.status==="DONE").length },
  ];

  return (
    <div className="space-y-4">
      {/* Filter + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filter === f.id
                  ? "bg-[#E07B00] text-white border-[#E07B00] shadow-sm"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              {f.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === f.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-stone-400" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="price_desc">Сумма: по убыванию</option>
            <option value="price_asc">Сумма: по возрастанию</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
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

          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl border shadow-sm transition-all ${
                b.status === "NEW" ? "border-amber-200" :
                b.status === "IN_PROGRESS" ? "border-blue-200" : "border-stone-200"
              }`}
            >
              {/* Card header */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">

                {/* Left: name + badge */}
                <div className="flex items-center gap-3 lg:w-44 shrink-0">
                  <div>
                    <div className="font-bold text-stone-900 text-base leading-tight">{b.name}</div>
                    <span className={`mt-1 inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold border ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* Center: info fields grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-3">

                  {/* Телефон */}
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Телефон</div>
                    <a
                      href={`tel:${b.phone.replace(/\D/g, "")}`}
                      className="text-sm font-semibold text-[#E07B00] hover:text-[#B86300] transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 shrink-0" />
                      {b.phone}
                    </a>
                  </div>

                  {/* Машина */}
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Машина</div>
                    <div className="text-sm text-stone-800 font-medium flex items-center gap-1">
                      <Car className="w-3 h-3 text-stone-400 shrink-0" />
                      {b.carBrand || <span className="text-stone-300 font-normal">—</span>}
                    </div>
                  </div>

                  {/* Госномер */}
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Госномер</div>
                    <div className="text-sm font-mono font-semibold text-stone-800 tracking-widest uppercase">
                      {b.carPlate || <span className="text-stone-300 font-normal font-sans tracking-normal">—</span>}
                    </div>
                  </div>

                  {/* Дата заказа */}
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Дата заказа</div>
                    <div className="text-sm text-stone-700 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-stone-400 shrink-0" />
                      {new Date(b.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Желаемая дата */}
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Желаемая дата</div>
                    <div className="text-sm text-stone-700 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-stone-400 shrink-0" />
                      {b.date
                        ? new Date(b.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
                        : <span className="text-stone-300">не указана</span>
                      }
                    </div>
                  </div>
                </div>

                {/* Right: price + actions */}
                <div className="flex items-center gap-2 shrink-0 lg:pl-4 lg:border-l lg:border-stone-100">
                  {parsedServices.length === 0 || b.totalPrice === 0 ? (
                    /* Callback-only request */
                    <div className="flex flex-col items-center gap-1">
                      <span className="relative flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 whitespace-nowrap">
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        📞 Ждёт звонка
                      </span>
                    </div>
                  ) : (
                    <div className="text-right mr-1">
                      <div className="text-lg font-bold font-mono text-stone-900 whitespace-nowrap">{b.totalPrice.toLocaleString("ru-RU")} ₽</div>
                      <div className="text-xs text-stone-400">{parsedServices.length} {parsedServices.length === 1 ? "услуга" : parsedServices.length < 5 ? "услуги" : "услуг"}</div>
                    </div>
                  )}

                  {/* Status toggle */}
                  <button
                    onClick={() => cycleStatus(b.id)}
                    disabled={isPending}
                    title={meta.next}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80 whitespace-nowrap ${meta.cls}`}
                  >
                    {meta.next}
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : b.id)}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 transition shrink-0"
                    title="Показать услуги"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition shrink-0"
                    title="Удалить заявку"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expanded: services list */}
              {isExpanded && (
                <div className="border-t border-stone-100 px-5 py-4 bg-stone-50 rounded-b-2xl">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5" />
                    Выбранные услуги
                  </h4>
                  {parsedServices.length > 0 ? (
                    <ul className="space-y-1.5">
                      {parsedServices.map((s, i) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                          <span className="text-stone-700">{s.title}</span>
                          <span className="font-mono font-semibold text-stone-900">{s.price?.toLocaleString("ru-RU")} ₽</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-400 text-sm">{b.services}</p>
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
