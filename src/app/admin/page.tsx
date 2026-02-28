import { prisma } from "@/lib/prisma";
import { Activity, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import ServicesManager from "./ServicesManager";

export default async function AdminDashboard() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });

  async function deleteBooking(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await prisma.booking.delete({ where: { id } });
    revalidatePath("/admin");
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6 pt-24 text-stone-900">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-emerald-800" />
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Панель администратора</h1>
        </div>
        
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-stone-900">Заявки</h2>
          </div>
          <div className="bg-white border border-stone-200 shadow-sm rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-900 uppercase">
                <tr>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4">Имя / Телефон</th>
                  <th className="px-6 py-4">Желаемая дата</th>
                  <th className="px-6 py-4">Услуги</th>
                  <th className="px-6 py-4">Сумма</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {bookings.map((b) => {
                  let parsedServices = [];
                  try { parsedServices = JSON.parse(b.services); } catch(e){}
                  return (
                    <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString('ru-RU')}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900">{b.name}</div>
                        <div className="text-stone-500">{b.phone}</div>
                      </td>
                      <td className="px-6 py-4">{b.date || "-"}</td>
                      <td className="px-6 py-4 max-w-xs truncate" title={parsedServices.map((s:any)=>s.title).join(", ")}>
                        {parsedServices.map((s:any)=>s.title).join(", ") || b.services}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-800">{b.totalPrice} ₽</td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <button type="submit" className="text-red-500 hover:text-stone-700 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
                {bookings.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-stone-500">Заявок пока нет</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <ServicesManager />
        </section>
      </div>
    </div>
  )
}
