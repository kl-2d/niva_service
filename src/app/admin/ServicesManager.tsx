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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C8553D] disabled:opacity-50 ${isActive ? "bg-emerald-500" : "bg-[#D1CBC3]"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isActive ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
      <span
        className={`text-xs font-semibold w-6 select-none ${isActive ? "text-emerald-600" : "text-[#9C9488]"
          }`}
      >
        {isActive ? "Да" : "Нет"}
      </span>
    </div>
  );
}

export default function ServicesManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCatId, setEditCatId] = useState<string>("");
  const [editDesc, setEditDesc] = useState("");

  // Add form state
  const [addTitle, setAddTitle] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCatId, setAddCatId] = useState<string>("");
  const [addDesc, setAddDesc] = useState("");

  useEffect(() => {
    fetchServices();
    fetch("/api/categories").then(r => r.json()).then((data) => {
      if (Array.isArray(data)) setCategories(data);
    }).catch(() => { });
  }, []);

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

  const inputCls = "bg-[#F0EDE8] border border-[#D1CBC3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] text-[#1C1F23]";

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9488]" />
          <input
            type="text"
            placeholder="Поиск по названию…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D1CBC3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] text-[#1C1F23]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9488] hover:text-[#1C1F23]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => { setShowAddForm(!showAddForm); setSearch(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold rounded-xl transition-colors shadow-sm shrink-0"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Отмена" : "Добавить услугу"}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={addService} className="bg-white border-2 border-[#C8553D]/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-[#1C1F23] text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#C8553D]" />
            Новая услуга
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Название услуги *" value={addTitle} onChange={e => setAddTitle(e.target.value)} className={inputCls} />
            <input required type="number" placeholder="Цена (₽) *" value={addPrice} onChange={e => setAddPrice(e.target.value)} className={inputCls} />
            <select value={addCatId} onChange={e => setAddCatId(e.target.value)} className={inputCls}>
              <option value="">— Категория —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Описание (необязательно)" value={addDesc} onChange={e => setAddDesc(e.target.value)} className={inputCls} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 bg-[#E6E2DC] text-[#6B635C] rounded-xl font-semibold text-sm hover:bg-[#D1CBC3] transition">Отмена</button>
            <button type="submit" disabled={isPending} className="px-5 py-2.5 bg-[#C8553D] text-white rounded-xl font-bold text-sm hover:bg-[#A8442F] transition disabled:opacity-60">
              {isPending ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </form>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCatFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${catFilter === null ? "bg-[#1C1F23] text-white border-[#1C1F23]" : "bg-white text-[#6B635C] border-[#D1CBC3] hover:border-[#C8553D]/40"}`}
        >
          Все <span className="ml-1 text-xs opacity-70">({services.length})</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${catFilter === cat.id ? "bg-[#1C1F23] text-white border-[#1C1F23]" : "bg-white text-[#6B635C] border-[#D1CBC3] hover:border-[#C8553D]/40"}`}
          >
            {cat.name} <span className="ml-1 text-xs opacity-70">({countByCat(cat.id)})</span>
          </button>
        ))}
      </div>

      {/* Services list */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#D1CBC3] p-12 text-center text-[#9C9488]">
          <div className="w-8 h-8 border-2 border-[#D1CBC3] border-t-[#C8553D] rounded-full animate-spin mx-auto mb-3" />
          Загрузка…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D1CBC3] p-12 text-center text-[#9C9488]">
          {search ? `Услуги по запросу «${search}» не найдены` : "Услуг в этой категории нет"}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D1CBC3] shadow-sm overflow-hidden">
          {/* Column header */}
          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-[#E6E2DC] border-b border-[#D1CBC3] text-xs font-semibold text-[#6B635C] uppercase tracking-wider">
            <span className="flex-1">Название</span>
            <span className="w-36 text-center">Категория</span>
            <span className="w-24 text-right">Цена</span>
            <span className="w-36 text-center">Активность на сайте</span>
            <span className="w-[72px]" />
          </div>

          {filtered.map((s, idx) => (
            <div key={s.id} className={`${idx !== 0 ? "border-t border-[#E6E2DC]" : ""}`}>
              {editingId === s.id ? (
                /* ── Edit mode ── */
                <div className="px-5 py-3 flex items-center gap-4 bg-[#FAE8E4] border-l-4 border-[#C8553D]">
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-semibold text-[#9C9488] uppercase tracking-wider mb-1 block">Название</label>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]" />
                  </div>
                  <div className="shrink-0 w-36">
                    <label className="text-[10px] font-semibold text-[#9C9488] uppercase tracking-wider mb-1 block">Категория</label>
                    <select value={editCatId} onChange={e => setEditCatId(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]">
                      <option value="">— Без категории —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="shrink-0 w-24">
                    <label className="text-[10px] font-semibold text-[#9C9488] uppercase tracking-wider mb-1 block">Цена (₽)</label>
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]" />
                  </div>
                  <div className="shrink-0 w-36" />
                  <div className="flex items-center gap-1 shrink-0 w-[72px] justify-end">
                    <button onClick={cancelEdit} className="p-2 rounded-lg hover:bg-white text-[#9C9488] hover:text-[#1C1F23] transition" title="Отмена">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={() => saveEdit(s.id)} disabled={isPending} className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60" title="Сохранить">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div className={`px-5 py-3.5 flex items-center gap-4 group transition-colors ${s.isActive ? "hover:bg-[#F0EDE8]" : "bg-[#F0EDE8]/60 hover:bg-[#E6E2DC]/60"}`}>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${s.isActive ? "text-[#1C1F23]" : "text-[#9C9488] line-through"}`}>
                      {s.title}
                    </div>
                    {s.description && <div className="text-xs text-[#9C9488] truncate mt-0.5">{s.description}</div>}
                  </div>
                  <div className="shrink-0 w-36 text-center">
                    {s.category ? (
                      <span className="inline-block text-xs px-2.5 py-1 bg-[#E6E2DC] text-[#6B635C] rounded-lg border border-[#D1CBC3] font-medium leading-snug text-center">
                        {s.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-[#D1CBC3]">—</span>
                    )}
                  </div>
                  <div className={`font-bold shrink-0 w-24 text-right ${s.isActive ? "text-[#1C1F23]" : "text-[#9C9488]"}`} style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>
                    {s.price.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="shrink-0 w-36 flex justify-center">
                    <ActiveToggle serviceId={s.id} isActive={s.isActive} onChange={handleToggle} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => startEdit(s)} className="p-2 rounded-lg hover:bg-[#FAE8E4] text-[#9C9488] hover:text-[#C8553D] transition" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteService(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#9C9488] hover:text-red-500 transition" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Footer count */}
          <div className="border-t border-[#D1CBC3] px-5 py-3 bg-[#E6E2DC] flex justify-between text-xs text-[#6B635C]">
            <span>
              Показано: {filtered.length} {filtered.length === 1 ? "позиция" : filtered.length < 5 ? "позиции" : "позиций"}
              {filtered.filter(s => !s.isActive).length > 0 && (
                <span className="ml-2 text-[#C8553D]">
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
