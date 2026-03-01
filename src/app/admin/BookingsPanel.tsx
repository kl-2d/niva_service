"use client";

import { useState, useTransition } from "react";
import { Phone, Trash2, ChevronDown, Car, CalendarDays, Wrench } from "lucide-react";

interface Booking {
  id: number;
  createdAt: Date;
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

export default function BookingsPanel({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);

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
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
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
              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left: name + phone */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-stone-900 text-lg">{b.name}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-stone-500">
                    <a href={`tel:${b.phone.replace(/\D/g,"")}`} className="flex items-center gap-1.5 hover:text-[#E07B00] transition-colors font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      {b.phone}
                    </a>
                    {b.carBrand && (
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        {b.carBrand}{b.carPlate ? ` · ${b.carPlate}` : ""}
                      </span>
                    )}
                    {b.date && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(b.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "long" })}
                      </span>
                    )}
                    <span className="text-stone-400 text-xs">
                      {new Date(b.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>

                {/* Right: price + actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-stone-900">{b.totalPrice.toLocaleString("ru-RU")} ₽</div>
                    <div className="text-xs text-stone-400">{parsedServices.length} {parsedServices.length === 1 ? "услуга" : parsedServices.length < 5 ? "услуги" : "услуг"}</div>
                  </div>

                  {/* Status toggle */}
                  <button
                    onClick={() => cycleStatus(b.id)}
                    disabled={isPending}
                    title={meta.next}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80 ${meta.cls}`}
                  >
                    {meta.next}
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : b.id)}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 transition"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition"
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
