"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, X, Check, Activity } from "lucide-react";
import { Service } from "@prisma/client";

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Input states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("engine");
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
      body: JSON.stringify({ title, price, category, description }),
    });

    setIsAdding(false);
    resetForm();
    fetchServices();
  };

  const handleUpdate = async (id: number) => {
    await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, category, description }),
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

  const startEditing = (s: Service) => {
    setEditingId(s.id);
    setTitle(s.title);
    setPrice(s.price.toString());
    setCategory(s.category);
    setDescription(s.description || "");
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("engine");
    setDescription("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-white">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight">Панель управления (MVP)</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить услугу
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mb-8 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white">Новая услуга</h2>
              <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Название услуги" value={title} onChange={e => setTitle(e.target.value)} className="bg-zinc-800 text-white rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700" />
              <input required type="number" placeholder="Цена (₽)" value={price} onChange={e => setPrice(e.target.value)} className="bg-zinc-800 text-white rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-zinc-800 text-white rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700">
                <option value="engine">Двигатель</option>
                <option value="suspension">Ходовая</option>
                <option value="transmission">КПП / Раздатка</option>
                <option value="electrical">Электрика</option>
              </select>
              <input placeholder="Описание (необязательно)" value={description} onChange={e => setDescription(e.target.value)} className="bg-zinc-800 text-white rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700" />
            </div>
            <button type="submit" className="bg-white text-black font-semibold py-2 px-6 rounded hover:bg-zinc-200 self-end">
              Сохранить
            </button>
          </form>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-zinc-500">Загрузка услуг...</div>
          ) : (
            <table className="w-full text-left text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Название</th>
                  <th className="px-6 py-4">Категория</th>
                  <th className="px-6 py-4">Описание</th>
                  <th className="px-6 py-4">Цена</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                    {editingId === s.id ? (
                      <td colSpan={5} className="p-4 bg-zinc-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <input value={title} onChange={e => setTitle(e.target.value)} className="bg-zinc-900 text-white rounded p-2 text-sm border border-zinc-700" />
                          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-zinc-900 text-white rounded p-2 text-sm border border-zinc-700">
                             <option value="engine">Двигатель</option>
                             <option value="suspension">Ходовая</option>
                             <option value="transmission">КПП / Раздатка</option>
                             <option value="electrical">Электрика</option>
                          </select>
                          <input value={description} onChange={e => setDescription(e.target.value)} className="bg-zinc-900 text-white rounded p-2 text-sm border border-zinc-700" />
                          <div className="flex items-center gap-2">
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="bg-zinc-900 text-white rounded p-2 text-sm border border-zinc-700 w-24" />
                            <button onClick={() => handleUpdate(s.id)} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded"><Check className="w-4 h-4"/></button>
                            <button onClick={resetForm} className="p-2 bg-zinc-700 text-white hover:bg-zinc-600 rounded"><X className="w-4 h-4"/></button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-white">{s.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-zinc-800 text-xs rounded-full">{s.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500 truncate max-w-[200px]">{s.description || "-"}</td>
                        <td className="px-6 py-4 font-mono">{s.price} ₽</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => startEditing(s)} className="text-zinc-500 hover:text-white mr-3"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(s.id)} className="text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {services.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Услуги не найдены</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
