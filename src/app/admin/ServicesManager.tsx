"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Pencil, Plus, X, Check, Search } from "lucide-react";

type CategoryObj = { id: number; name: string; slug: string };
type ServiceWithCategory = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  isActive: boolean;
  categoryId: number | null;
  category: CategoryObj | null;
};

const CATEGORIES: CategoryObj[] = [
  { id: 1,  name: "Ходовая",          slug: "hodovoy"     },
  { id: 2,  name: "Двигатель",        slug: "engine"      },
  { id: 3,  name: "КПП",              slug: "kpp"         },
  { id: 4,  name: "Раздатка",         slug: "razdatka"    },
  { id: 5,  name: "Редукторы",        slug: "reduktory"   },
  { id: 6,  name: "Выхлопная",        slug: "vykhlopnaya" },
  { id: 7,  name: "Тюнинг",           slug: "tuning"      },
  { id: 8,  name: "Развал-схождение", slug: "rasval"      },
  { id: 9,  name: "Электрика",        slug: "electrics"   },
];

/* ── Toggle Switch component ───────────────────────────────────── */
function ActiveToggle({
  serviceId,
  isActive,
  onChange,
}: {
  serviceId: number;
  isActive: boolean;
  onChange: (id: number, newValue: boolean) => void;
}) {
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    setPending(true);
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) onChange(serviceId, !isActive);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        role="switch"
        aria-checked={isActive}
        onClick={toggle}
        disabled={pending}
        title={isActive ? "Скрыть на сайте" : "Показать на сайте"}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#E07B00] disabled:opacity-50 ${
          isActive ? "bg-emerald-500" : "bg-stone-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold w-6 select-none ${
          isActive ? "text-emerald-600" : "text-stone-400"
        }`}
      >
        {isActive ? "Да" : "Нет"}
      </span>
    </div>
  );
}

export default function ServicesManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [services, setServices]     = useState<ServiceWithCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState<number | null>(null);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCatId, setEditCatId] = useState<string>("");
  const [editDesc, setEditDesc]   = useState("");

  // Add form state
  const [addTitle, setAddTitle] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCatId, setAddCatId] = useState<string>("");
  const [addDesc, setAddDesc]   = useState("");

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?admin=true");
      const data = await res.json();
      const list: ServiceWithCategory[] = Array.isArray(data) ? data : [];
      setServices(list);
      onCountChange?.(list.length);
    } catch { }
    finally { setLoading(false); }
  };

  const handleToggle = (id: number, newValue: boolean) => {
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, isActive: newValue } : s)
    );
  };

  const startEdit = (s: ServiceWithCategory) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditPrice(s.price.toString());
    setEditCatId(s.categoryId?.toString() ?? "");
    setEditDesc(s.description ?? "");
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = (id: number) => {
    startTransition(async () => {
      await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, price: editPrice, categoryId: editCatId ? parseInt(editCatId) : null, description: editDesc }),
      });
      setEditingId(null);
      fetchServices();
    });
  };

  const deleteService = (id: number) => {
    if (!confirm("Удалить услугу из каталога?")) return;
    startTransition(async () => {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      fetchServices();
    });
  };

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle || !addPrice) return;
    startTransition(async () => {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: addTitle, price: addPrice, categoryId: addCatId ? parseInt(addCatId) : null, description: addDesc }),
      });
      setShowAddForm(false);
      setAddTitle(""); setAddPrice(""); setAddCatId(""); setAddDesc("");
      fetchServices();
    });
  };

  const filtered = services.filter(s => {
    const matchCat = catFilter === null ? true : s.categoryId === catFilter;
    const matchSearch = search === "" ? true : s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const countByCat = (id: number) => services.filter(s => s.categoryId === id).length;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Поиск по названию…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => { setShowAddForm(!showAddForm); setSearch(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E07B00] hover:bg-[#B86300] text-white font-bold rounded-xl transition-colors shadow-sm shrink-0"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Отмена" : "Добавить услугу"}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={addService} className="bg-white border-2 border-[#E07B00]/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#E07B00]" />
            Новая услуга
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Название услуги *"
              value={addTitle}
              onChange={e => setAddTitle(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
            />
            <input
              required
              type="number"
              placeholder="Цена (₽) *"
              value={addPrice}
              onChange={e => setAddPrice(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
            />
            <select
              value={addCatId}
              onChange={e => setAddCatId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
            >
              <option value="">— Категория —</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              placeholder="Описание (необязательно)"
              value={addDesc}
              onChange={e => setAddDesc(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-200 transition">Отмена</button>
            <button type="submit" disabled={isPending} className="px-5 py-2.5 bg-[#E07B00] text-white rounded-xl font-bold text-sm hover:bg-[#B86300] transition disabled:opacity-60">
              {isPending ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </form>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCatFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${catFilter === null ? "bg-[#2B3A2E] text-white border-[#2B3A2E]" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"}`}
        >
          Все <span className="ml-1 text-xs opacity-70">({services.length})</span>
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${catFilter === cat.id ? "bg-[#2B3A2E] text-white border-[#2B3A2E]" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"}`}
          >
            {cat.name} <span className="ml-1 text-xs opacity-70">({countByCat(cat.id)})</span>
          </button>
        ))}
      </div>

      {/* Services list */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-[#E07B00] rounded-full animate-spin mx-auto mb-3" />
          Загрузка…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
          {search ? `Услуги по запросу «${search}» не найдены` : "Услуг в этой категории нет"}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Column header */}
          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-stone-50 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <span className="flex-1">Название</span>
            <span className="w-36 text-center">Категория</span>
            <span className="w-24 text-right">Цена</span>
            <span className="w-36 text-center">Активность на сайте</span>
            <span className="w-[72px]" />
          </div>

          {filtered.map((s, idx) => (
            <div key={s.id} className={`${idx !== 0 ? "border-t border-stone-100" : ""}`}>
              {editingId === s.id ? (
                /* ── Edit mode: same flex layout as view mode ── */
                <div className="px-5 py-3 flex items-center gap-4 bg-amber-50 border-l-4 border-[#E07B00]">
                  {/* Title input — flex-1 to match view mode */}
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1 block">Название</label>
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00]"
                    />
                  </div>

                  {/* Category — w-36 matches header */}
                  <div className="shrink-0 w-36">
                    <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1 block">Категория</label>
                    <select
                      value={editCatId}
                      onChange={e => setEditCatId(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00]"
                    >
                      <option value="">— Без категории —</option>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Price — w-24 matches header */}
                  <div className="shrink-0 w-24">
                    <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1 block">Цена (₽)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B00]"
                    />
                  </div>

                  {/* Placeholder for toggle column — w-36 */}
                  <div className="shrink-0 w-36" />

                  {/* Save / Cancel — w-[72px] matches actions column */}
                  <div className="flex items-center gap-1 shrink-0 w-[72px] justify-end">
                    <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-white text-stone-400 hover:text-stone-700 transition" title="Отмена">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={() => saveEdit(s.id)} disabled={isPending} className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60" title="Сохранить">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div className={`px-5 py-3.5 flex items-center gap-4 group transition-colors ${s.isActive ? "hover:bg-stone-50" : "bg-stone-50/60 hover:bg-stone-100/60"}`}>
                  {/* Title + description */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${s.isActive ? "text-stone-900" : "text-stone-400 line-through"}`}>
                      {s.title}
                    </div>
                    {s.description && <div className="text-xs text-stone-400 truncate mt-0.5">{s.description}</div>}
                  </div>

                  {/* Category badge — w-36 matches header, text can wrap */}
                  <div className="shrink-0 w-36 text-center">
                    {s.category ? (
                      <span className="inline-block text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg border border-stone-200 font-medium leading-snug text-center">
                        {s.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className={`font-mono font-bold shrink-0 w-24 text-right ${s.isActive ? "text-stone-900" : "text-stone-400"}`}>
                    {s.price.toLocaleString("ru-RU")} ₽
                  </div>

                  {/* Active toggle */}
                  <div className="shrink-0 w-36 flex justify-center">
                    <ActiveToggle
                      serviceId={s.id}
                      isActive={s.isActive}
                      onChange={handleToggle}
                    />
                  </div>

                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => startEdit(s)}
                      className="p-2 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Footer count */}
          <div className="border-t border-stone-100 px-5 py-3 bg-stone-50 flex justify-between text-xs text-stone-400">
            <span>
              Показано: {filtered.length} {filtered.length === 1 ? "позиция" : filtered.length < 5 ? "позиции" : "позиций"}
              {filtered.filter(s => !s.isActive).length > 0 && (
                <span className="ml-2 text-amber-500">
                  ({filtered.filter(s => !s.isActive).length} скрыто)
                </span>
              )}
            </span>
            <span>Всего в каталоге: {services.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
