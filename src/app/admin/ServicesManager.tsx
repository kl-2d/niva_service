"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Pencil, Plus, X, Check, Search, Loader2, Package, FolderOpen } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
interface CategoryObj { id: number; name: string; slug: string }
interface ServiceWithCategory {
  id: number;
  title: string;
  description: string | null;
  price: number;
  isActive: boolean;
  categoryId: number | null;
  category: CategoryObj | null;
}

/* ── Toggle Switch ─────────────────────────────────────────────── */
function ActiveToggle({
  serviceId, isActive, onChange,
}: {
  serviceId: number;
  isActive: boolean;
  onChange: (id: number, v: boolean) => void;
}) {
  const [local, setLocal] = useState(isActive);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !local;
    setLocal(next);
    setSaving(true);
    try {
      await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      onChange(serviceId, next);
    } catch { setLocal(!next); }
    finally { setSaving(false); }
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${local ? "bg-emerald-500" : "bg-[#D1CBC3]"} ${saving ? "opacity-60" : ""}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${local ? "translate-x-5" : ""}`} />
      <span className="ml-14 text-xs font-medium whitespace-nowrap select-none">{local ? "Да" : "Нет"}</span>
    </button>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */
const inputCls = "bg-[#F0EDE8] border border-[#D1CBC3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] text-[#1C1F23] w-full";

/* ── Main Component ────────────────────────────────────────────── */
export default function ServicesManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCatId, setEditCatId] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Add form state
  const [addTitle, setAddTitle] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCatId, setAddCatId] = useState("");
  const [addDesc, setAddDesc] = useState("");

  useEffect(() => {
    fetchServices();
    fetch("/api/categories").then(r => r.json()).then((data) => {
      if (Array.isArray(data)) setCategories(data);
    }).catch(() => { });
  }, []);

  // Auto-select first category once loaded
  useEffect(() => {
    if (categories.length > 0 && selectedCatId === null) {
      setSelectedCatId(categories[0].id);
    }
  }, [categories, selectedCatId]);

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
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: newValue } : s));
  };

  const startEdit = (s: ServiceWithCategory) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditPrice(s.price.toString());
    setEditCatId(s.categoryId?.toString() ?? "");
    setEditDesc(s.description ?? "");
    setConfirmDeleteId(null);
  };

  const cancelEdit = () => setEditingId(null);

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

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(null);
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
        body: JSON.stringify({
          title: addTitle,
          price: addPrice,
          categoryId: addCatId ? parseInt(addCatId) : (selectedCatId ?? null),
          description: addDesc,
        }),
      });
      setShowAddForm(false);
      setAddTitle(""); setAddPrice(""); setAddCatId(""); setAddDesc("");
      fetchServices();
    });
  };

  /* ── Filtering ── */
  const countByCat = (id: number) => services.filter(s => s.categoryId === id).length;

  const isSearching = search.length > 0;

  const filteredServices = services.filter(s => {
    if (isSearching) {
      return s.title.toLowerCase().includes(search.toLowerCase());
    }
    return selectedCatId === null ? true : s.categoryId === selectedCatId;
  });

  const selectedCategory = categories.find(c => c.id === selectedCatId);

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* ── Search bar (full width) ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9488]" />
        <input
          type="text"
          placeholder="Поиск услуги по названию…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D1CBC3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] focus:border-[#C8553D] text-[#1C1F23]"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9488] hover:text-[#1C1F23]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div className="flex gap-4 items-start">

        {/* ════════ LEFT: Category sidebar ════════ */}
        <div className="w-64 shrink-0 bg-white border border-[#D1CBC3] rounded-2xl overflow-hidden shadow-sm flex flex-col sticky top-4 self-start">
          <div className="px-4 py-3 bg-[#E6E2DC] border-b border-[#D1CBC3]">
            <h3 className="text-xs font-bold text-[#6B635C] uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5" />
              Категории ({categories.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {categories.map(cat => {
              const count = countByCat(cat.id);
              const isSelected = !isSearching && selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCatId(cat.id); setSearch(""); }}
                  className={`w-full text-left px-4 py-3 border-b border-[#F0EDE8] flex items-center justify-between transition-all group ${isSelected
                    ? "bg-[#C8553D]/10 border-l-4 border-l-[#C8553D]"
                    : "hover:bg-[#F0EDE8] border-l-4 border-l-transparent"
                    }`}
                >
                  <span className={`text-sm font-medium truncate ${isSelected ? "text-[#C8553D] font-bold" : "text-[#1C1F23]"}`}>
                    {cat.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${isSelected
                    ? "bg-[#C8553D] text-white font-bold"
                    : count === 0
                      ? "bg-[#F0EDE8] text-[#D1CBC3]"
                      : "bg-[#E6E2DC] text-[#6B635C] font-medium"
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Summary */}
          <div className="px-4 py-2.5 bg-[#E6E2DC] border-t border-[#D1CBC3] text-xs text-[#6B635C]">
            Всего: <strong>{services.length}</strong> услуг
          </div>
        </div>

        {/* ════════ RIGHT: Services list ════════ */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="bg-white border border-[#D1CBC3] rounded-t-2xl px-5 py-3 flex items-center justify-between">
            {isSearching ? (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#9C9488]" />
                <h3 className="font-bold text-[#1C1F23]">
                  Результаты поиска «{search}»
                </h3>
                <span className="text-xs text-[#9C9488]">{filteredServices.length} найдено</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C8553D]/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#C8553D]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1C1F23] text-base leading-tight">
                    {selectedCategory?.name ?? "Выберите категорию"}
                  </h3>
                  <p className="text-xs text-[#9C9488]">
                    {filteredServices.length} {filteredServices.length === 1 ? "услуга" : filteredServices.length < 5 ? "услуги" : "услуг"}
                    {filteredServices.filter(s => !s.isActive).length > 0 && (
                      <span className="text-[#C8553D] ml-1">
                        · {filteredServices.filter(s => !s.isActive).length} скрыто
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (!showAddForm) setAddCatId(selectedCatId?.toString() ?? "");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold rounded-xl transition-colors shadow-sm text-sm shrink-0"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? "Отмена" : "Добавить"}
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <form onSubmit={addService} className="bg-[#FAE8E4] border-x border-[#D1CBC3] px-5 py-4 space-y-3">
              <h4 className="text-sm font-bold text-[#C8553D] flex items-center gap-2">
                <Plus className="w-4 h-4" /> Новая услуга
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="Название услуги *" value={addTitle} onChange={e => setAddTitle(e.target.value)} className={inputCls} />
                <input required type="number" placeholder="Цена (₽) *" value={addPrice} onChange={e => setAddPrice(e.target.value)} className={inputCls} />
                <select value={addCatId} onChange={e => setAddCatId(e.target.value)} className={inputCls}>
                  <option value="">— Категория —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input placeholder="Описание (необязательно)" value={addDesc} onChange={e => setAddDesc(e.target.value)} className={inputCls} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-[#E6E2DC] text-[#6B635C] rounded-xl font-semibold text-sm hover:bg-[#D1CBC3] transition">Отмена</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-[#C8553D] text-white rounded-xl font-bold text-sm hover:bg-[#A8442F] transition disabled:opacity-60">
                  {isPending ? "Сохранение…" : "Сохранить"}
                </button>
              </div>
            </form>
          )}

          {/* Services table */}
          <div className="flex-1 bg-white border-x border-b border-[#D1CBC3] rounded-b-2xl overflow-hidden shadow-sm flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-[#9C9488] py-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#D1CBC3]" />
                  Загрузка…
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[#9C9488] py-20">
                <div className="text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">
                    {isSearching ? `По запросу «${search}» ничего не найдено` : "В этой категории пока нет услуг"}
                  </p>
                  {!isSearching && (
                    <button onClick={() => { setShowAddForm(true); setAddCatId(selectedCatId?.toString() ?? ""); }} className="mt-3 text-sm text-[#C8553D] hover:underline font-medium">
                      + Добавить первую услугу
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {/* Column header */}
                <div className="sticky top-0 z-10 hidden md:flex items-center gap-4 px-5 py-2 bg-[#F7F5F2] border-b border-[#E6E2DC] text-[10px] font-bold text-[#9C9488] uppercase tracking-wider">
                  <span className="flex-1">Название</span>
                  {isSearching && <span className="w-28 text-center">Категория</span>}
                  <span className="w-24 text-right">Цена</span>
                  <span className="w-20 text-center">На сайте</span>
                  <span className="w-28 text-right">Действия</span>
                </div>

                {filteredServices.map((s) => (
                  <div key={s.id} className="border-b border-[#F0EDE8] last:border-b-0">
                    {editingId === s.id ? (
                      /* ── Edit mode ── */
                      <div className="px-5 py-3 bg-[#FAE8E4] border-l-4 border-[#C8553D] space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-[#9C9488] uppercase tracking-wider mb-1 block">Название</label>
                            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#9C9488] uppercase tracking-wider mb-1 block">Цена (₽)</label>
                            <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-[#9C9488] uppercase tracking-wider mb-1 block">Категория</label>
                            <select value={editCatId} onChange={e => setEditCatId(e.target.value)} className="w-full bg-white border border-[#D1CBC3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]">
                              <option value="">— Без категории —</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-[#9C9488] uppercase tracking-wider mb-1 block">Описание</label>
                            <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Необязательно" className="w-full bg-white border border-[#D1CBC3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-[#1C1F23]" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={cancelEdit} className="px-4 py-2 bg-[#E6E2DC] text-[#6B635C] rounded-lg font-semibold text-sm hover:bg-[#D1CBC3] transition">Отмена</button>
                          <button onClick={() => saveEdit(s.id)} disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-60">
                            {isPending ? "Сохранение…" : "Сохранить"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View mode ── */
                      <div className={`px-5 py-3 flex items-center gap-4 transition-colors ${s.isActive ? "hover:bg-[#F7F5F2]" : "bg-[#F0EDE8]/50"}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm truncate ${s.isActive ? "text-[#1C1F23]" : "text-[#9C9488] line-through"}`}>
                            {s.title}
                          </div>
                          {s.description && <div className="text-xs text-[#9C9488] truncate mt-0.5">{s.description}</div>}
                        </div>
                        {/* Show category badge only in search mode */}
                        {isSearching && (
                          <div className="shrink-0 w-28 text-center">
                            {s.category ? (
                              <button
                                onClick={() => { setSelectedCatId(s.categoryId!); setSearch(""); }}
                                className="inline-block text-xs px-2 py-1 bg-[#E6E2DC] text-[#6B635C] rounded-lg border border-[#D1CBC3] font-medium hover:border-[#C8553D] hover:text-[#C8553D] transition cursor-pointer"
                              >
                                {s.category.name}
                              </button>
                            ) : (
                              <span className="text-xs text-[#D1CBC3]">—</span>
                            )}
                          </div>
                        )}
                        <div className={`font-bold shrink-0 w-24 text-right tabular-nums ${s.isActive ? "text-[#1C1F23]" : "text-[#9C9488]"}`} style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>
                          {s.price.toLocaleString("ru-RU")} ₽
                        </div>
                        <div className="shrink-0 w-20 flex justify-center">
                          <ActiveToggle serviceId={s.id} isActive={s.isActive} onChange={handleToggle} />
                        </div>
                        {/* Actions */}
                        <div className="shrink-0 w-28 flex items-center justify-end gap-1">
                          {confirmDeleteId === s.id ? (
                            <>
                              <span className="text-xs text-red-500 font-medium mr-1">Удалить?</span>
                              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" title="Да">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 rounded-lg bg-[#E6E2DC] text-[#6B635C] hover:bg-[#D1CBC3] transition" title="Отмена">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(s)} className="p-2 rounded-lg hover:bg-[#FAE8E4] text-[#9C9488] hover:text-[#C8553D] transition" title="Редактировать">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => setConfirmDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#9C9488] hover:text-red-500 transition" title="Удалить">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
