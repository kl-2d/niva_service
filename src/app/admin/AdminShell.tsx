"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Wrench, LogOut, Menu, X, ExternalLink,
  TrendingUp, Users, CalendarCheck, Package, Zap, Youtube,
} from "lucide-react";
import BookingsPanel from "./BookingsPanel";
import ServicesManager from "./ServicesManager";
import PromoManager from "./PromoManager";
import VideoReviewsManager from "./VideoReviewsManager";

type Tab = "dashboard" | "bookings" | "services" | "promo" | "reviews";

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

interface Props {
  bookings: Booking[];
  totalRevenue: number;
  newToday: number;
  servicesCount: number;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  NEW: { label: "Новая", cls: "bg-amber-100 text-amber-800 border border-amber-200" },
  IN_PROGRESS: { label: "В работе", cls: "bg-blue-100 text-blue-800 border border-blue-200" },
  DONE: { label: "Выполнено", cls: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
};

export { STATUS_LABEL };

export default function AdminShell({ bookings, totalRevenue, newToday, servicesCount: initialServicesCount }: Props) {
  const [tab, setTab] = useState<Tab>("bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [servicesCount, setServicesCount] = useState(initialServicesCount);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const navItems: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
    { id: "bookings", label: "Заявки", icon: ClipboardList, count: bookings.filter(b => b.status === "NEW").length },
    { id: "services", label: "Услуги", icon: Wrench },
    { id: "promo", label: "Акции", icon: Zap },
    { id: "reviews", label: "Отзывы", icon: Youtube },
  ];

  const stats = [
    { icon: ClipboardList, label: "Всего заявок", value: bookings.length, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    { icon: CalendarCheck, label: "Новых сегодня", value: newToday, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    { icon: TrendingUp, label: "В обработке", value: bookings.filter(b => b.status === "IN_PROGRESS").length, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    { icon: Package, label: "Услуг в каталоге", value: servicesCount, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <span className="text-white font-black text-xl uppercase tracking-widest block">Нива Сервис</span>
        <p className="text-stone-400 text-sm mt-1">Панель управления</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-base font-semibold transition-all ${isActive
                ? "bg-[#E07B00] text-white shadow-lg shadow-orange-900/30"
                : "text-stone-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-sm font-black px-2.5 py-1 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#E07B00] text-white"}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          На сайт
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Выйти из системы
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#1C1C1C] fixed top-0 left-0 h-full z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar (drawer) ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-[#1C1C1C] h-full z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-6 h-20 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-stone-100 text-stone-600 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-stone-900 leading-tight">
              {tab === "dashboard" ? "Дашборд"
                : tab === "bookings" ? "Заявки клиентов"
                  : tab === "services" ? "Каталог услуг"
                    : "Управление акциями"}
            </h1>
            <p className="text-sm text-stone-500 leading-none mt-0.5">
              {tab === "dashboard" ? "Сводка показателей"
                : tab === "bookings" ? "Управление заявками"
                  : tab === "services" ? "Редактирование услуг"
                    : "Промо-события на сайте"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 text-sm text-stone-500 hover:text-red-500 transition px-4 py-2.5 rounded-xl hover:bg-red-50 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-8">

          {/* Stats (always visible) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`bg-white rounded-2xl border-2 ${s.border} p-5 shadow-sm flex items-start gap-4`}>
                  <div className={`${s.bg} ${s.color} p-3.5 rounded-xl shrink-0 border ${s.border}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 mb-0.5 font-medium">{s.label}</p>
                    <p className="text-2xl font-black text-stone-900">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard tab */}
          {tab === "dashboard" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm p-6">
                <h2 className="font-black text-stone-900 mb-4 text-lg">Последние заявки</h2>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => {
                    const st = STATUS_LABEL[b.status] ?? STATUS_LABEL["NEW"];
                    return (
                      <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                        <div>
                          <div className="font-bold text-stone-900">{b.name}</div>
                          <div className="text-stone-400 text-sm">{new Date(b.createdAt).toLocaleDateString("ru-RU")}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-black text-stone-700">{b.totalPrice.toLocaleString("ru-RU")} ₽</span>
                          <span className={`text-sm px-2.5 py-1 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && <p className="text-stone-400 text-center py-4">Заявок пока нет</p>}
                </div>
                {bookings.length > 5 && (
                  <button onClick={() => setTab("bookings")} className="mt-4 text-base text-[#E07B00] font-bold hover:underline">
                    Показать все заявки →
                  </button>
                )}
              </div>
              <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center">
                <Users className="w-14 h-14 text-stone-200" />
                <div>
                  <p className="font-black text-stone-900 text-xl">Добро пожаловать!</p>
                  <p className="text-stone-500 text-base mt-2">Используйте меню слева для управления заявками, услугами и акциями.</p>
                </div>
                <div className="flex gap-3 mt-2 flex-wrap justify-center">
                  <button onClick={() => setTab("bookings")} className="px-5 py-2.5 bg-[#E07B00] text-white rounded-xl text-base font-bold hover:bg-[#B86300] transition">Заявки</button>
                  <button onClick={() => setTab("services")} className="px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-base font-bold hover:bg-stone-200 transition">Услуги</button>
                  <button onClick={() => setTab("promo")} className="px-5 py-2.5 bg-orange-50 text-[#E07B00] border border-[#E07B00]/30 rounded-xl text-base font-bold hover:bg-orange-100 transition">Акции</button>
                </div>
              </div>
            </div>
          )}

          {tab === "bookings" && <BookingsPanel initialBookings={bookings} />}
          {tab === "services" && <ServicesManager onCountChange={setServicesCount} />}
          {tab === "promo" && <PromoManager />}
          {tab === "reviews" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-stone-900">Видео отзывы</h2>
                <p className="text-stone-500 text-sm mt-1">Управление видеоотзывами на странице «О нас»</p>
              </div>
              <VideoReviewsManager />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
