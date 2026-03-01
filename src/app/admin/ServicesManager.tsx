"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, X, Check } from "lucide-react";

type CategoryObj = { id: number; name: string; slug: string };
type ServiceWithCategory = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  category: CategoryObj | null;
  createdAt: Date;
  updatedAt: Date;
};

const CATEGORY_OPTIONS: CategoryObj[] = [
  { id: 1, name: "Ходовая", slug: "hodovoy" },
  { id: 2, name: "Двигатель", slug: "engine" },
  { id: 3, name: "КПП", slug: "kpp" },
  { id: 4, name: "Раздатка", slug: "razdatka" },
  { id: 5, name: "Редукторы", slug: "reduktory" },
  { id: 6, name: "Выхлопная", slug: "vykhlopnaya" },
  { id: 7, name: "Тюнинг", slug: "tuning" },
  { id: 8, name: "Развал-схождение", slug: "rasval" },
  { id: 9, name: "Электрика", slug: "electrics" },
];

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Input states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        description,
      }),
    });

    setIsAdding(false);
    resetForm();
    fetchServices();
  };

  const handleUpdate = async (id: number) => {
    await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        description,
      }),
    });

    setEditingId(null);
    resetForm();
    fetchServices();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить услугу?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  const startEditing = (s: ServiceWithCategory) => {
    setEditingId(s.id);
    setTitle(s.title);
    setPrice(s.price.toString());
    setCategoryId(s.categoryId?.toString() ?? "");
    setDescription(s.description || "");
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategoryId("");
    setDescription("");
    setEditingId(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-stone-900">Услуги в каталоге</h3>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Добавить услугу
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white border border-stone-200 p-6 rounded-lg shadow-sm mb-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-stone-900">Новая услуга</h2>
            <button type="button" onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Название услуги" value={title} onChange={e => setTitle(e.target.value)} className="bg-stone-50 text-stone-900 rounded p-3 outline-none focus:ring-2 focus:ring-amber-500 border border-stone-300" />
            <input required type="number" placeholder="Цена (₽)" value={price} onChange={e => setPrice(e.target.value)} className="bg-stone-50 text-stone-900 rounded p-3 outline-none focus:ring-2 focus:ring-amber-500 border border-stone-300" />
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="bg-stone-50 text-stone-900 rounded p-3 outline-none focus:ring-2 focus:ring-amber-500 border border-stone-300">
              <option value="">— Без категории —</option>
              {CATEGORY_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input placeholder="Описание (необязательно)" value={description} onChange={e => setDescription(e.target.value)} className="bg-stone-50 text-stone-900 rounded p-3 outline-none focus:ring-2 focus:ring-amber-500 border border-stone-300" />
          </div>
          <button type="submit" className="bg-emerald-800 text-white font-bold py-2 px-6 rounded hover:bg-emerald-700 self-end transition">
            Сохранить
          </button>
        </form>
      )}

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-stone-500">Загрузка услуг...</div>
        ) : (
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-900 uppercase">
              <tr>
                <th className="px-6 py-4">Название</th>
                <th className="px-6 py-4">Категория</th>
                <th className="px-6 py-4">Описание</th>
                <th className="px-6 py-4">Цена</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                  {editingId === s.id ? (
                    <td colSpan={5} className="p-4 bg-amber-50 outline outline-1 outline-amber-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input value={title} onChange={e => setTitle(e.target.value)} className="bg-white text-stone-900 rounded p-2 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="bg-white text-stone-900 rounded p-2 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="">— Без категории —</option>
                          {CATEGORY_OPTIONS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <input value={description} onChange={e => setDescription(e.target.value)} className="bg-white text-stone-900 rounded p-2 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <div className="flex items-center gap-2">
                          <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="bg-white text-stone-900 rounded p-2 text-sm border border-stone-300 w-24 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          <button onClick={() => handleUpdate(s.id)} className="p-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded transition"><Check className="w-4 h-4"/></button>
                          <button onClick={resetForm} className="p-2 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded transition"><X className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-bold text-stone-900">{s.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-stone-100 border border-stone-300 text-xs rounded-lg text-stone-700">
                          {s.category?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-[200px]">{s.description || "-"}</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-800">{s.price} ₽</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => startEditing(s)} className="text-stone-500 hover:text-stone-900 mr-3 transition"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 transition"><Trash2 className="w-4 h-4"/></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {services.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-stone-500">Услуги не найдены</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
