"use client";

import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Wrench, LogOut, Menu, X, ExternalLink,
  TrendingUp, Users, CalendarCheck, Package,
} from "lucide-react";
import BookingsPanel from "./BookingsPanel";
import ServicesManager from "./ServicesManager";

type Tab = "dashboard" | "bookings" | "services";

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

interface Props {
  bookings: Booking[];
  totalRevenue: number;
  newToday: number;
  servicesCount: number;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  NEW:         { label: "Новая",     cls: "bg-amber-100 text-amber-800 border border-amber-200" },
  IN_PROGRESS: { label: "В работе", cls: "bg-blue-100 text-blue-800 border border-blue-200" },
  DONE:        { label: "Выполнено",cls: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
};

export { STATUS_LABEL };

export default function AdminShell({ bookings, totalRevenue, newToday, servicesCount }: Props) {
  const [tab, setTab] = useState<Tab>("bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "dashboard", label: "Дашборд",  icon: LayoutDashboard },
    { id: "bookings",  label: "Заявки",   icon: ClipboardList, count: bookings.filter(b => b.status === "NEW").length },
    { id: "services",  label: "Услуги",   icon: Wrench },
  ];

  const stats = [
    { icon: ClipboardList, label: "Всего заявок",   value: bookings.length,                   color: "text-blue-600",    bg: "bg-blue-50" },
    { icon: CalendarCheck, label: "Новых сегодня",  value: newToday,                           color: "text-amber-600",   bg: "bg-amber-50" },
    { icon: TrendingUp,    label: "Сумма заявок",   value: `${totalRevenue.toLocaleString("ru-RU")} ₽`, color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Package,       label: "Услуг в каталоге", value: servicesCount,                    color: "text-violet-600",  bg: "bg-violet-50" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-bold text-lg uppercase tracking-widest">Нива Сервис</span>
        <p className="text-stone-400 text-xs mt-0.5">Панель управления</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#E07B00] text-white shadow-lg shadow-orange-900/30"
                  : "text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#E07B00] text-white"}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          На сайт
        </a>
        <a
          href="/admin"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1C1C1C] fixed top-0 left-0 h-full z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar (drawer) ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[#1C1C1C] h-full z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-900">
              {tab === "dashboard" ? "Дашборд" : tab === "bookings" ? "Заявки клиентов" : "Каталог услуг"}
            </h1>
            <p className="text-xs text-stone-400">
              {tab === "dashboard" ? "Сводка показателей" : tab === "bookings" ? "Управление заявками на ремонт" : "Добавление и редактирование услуг"}
            </p>
          </div>
          {/* Mobile tab chips */}
          <div className="flex lg:hidden gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`p-2 rounded-lg transition ${tab === item.id ? "bg-[#E07B00] text-white" : "text-stone-500 hover:bg-stone-100"}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-8">

          {/* Stats (always visible) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex items-start gap-4">
                  <div className={`${s.bg} ${s.color} p-3 rounded-xl shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 mb-0.5">{s.label}</p>
                    <p className="text-xl font-bold text-stone-900">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard tab */}
          {tab === "dashboard" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-900 mb-4">Последние заявки</h2>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => {
                    const st = STATUS_LABEL[b.status] ?? STATUS_LABEL["NEW"];
                    return (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                        <div>
                          <div className="font-medium text-stone-900 text-sm">{b.name}</div>
                          <div className="text-stone-400 text-xs">{b.phone}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-stone-700">{b.totalPrice.toLocaleString("ru-RU")} ₽</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && <p className="text-stone-400 text-sm text-center py-4">Заявок пока нет</p>}
                </div>
                {bookings.length > 5 && (
                  <button onClick={() => setTab("bookings")} className="mt-4 text-sm text-[#E07B00] font-medium hover:underline">
                    Показать все заявки →
                  </button>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center">
                <Users className="w-12 h-12 text-stone-200" />
                <div>
                  <p className="font-bold text-stone-900 text-lg">Добро пожаловать!</p>
                  <p className="text-stone-500 text-sm mt-1">Используйте меню слева для управления заявками и услугами.</p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setTab("bookings")} className="px-4 py-2 bg-[#E07B00] text-white rounded-lg text-sm font-bold hover:bg-[#B86300] transition">Заявки</button>
                  <button onClick={() => setTab("services")} className="px-4 py-2 bg-stone-100 text-stone-800 rounded-lg text-sm font-bold hover:bg-stone-200 transition">Услуги</button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings tab */}
          {tab === "bookings" && <BookingsPanel initialBookings={bookings} />}

          {/* Services tab */}
          {tab === "services" && <ServicesManager />}

        </main>
      </div>
    </div>
  );
}
