"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Wrench, LogOut, Menu, X, ExternalLink,
  TrendingUp, Users, CalendarCheck, Package, Zap, Video,
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

// ─── Цвета сайдбара ──────────────────────────────────────────────
const SIDEBAR_BG = "#1C1F23";      // графитовый
const SIDEBAR_ACTIVE = "#C8553D";  // терракотовый акцент

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
    { id: "reviews", label: "Отзывы", icon: Video },
  ];

  const stats = [
    { icon: ClipboardList, label: "Всего заявок", value: bookings.length, color: "text-[#C8553D]", bg: "bg-[#FAE8E4]", border: "border-[#E8C5B8]" },
    { icon: CalendarCheck, label: "Новых сегодня", value: newToday, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    { icon: TrendingUp, label: "В обработке", value: bookings.filter(b => b.status === "IN_PROGRESS").length, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    { icon: Package, label: "Услуг в каталоге", value: servicesCount, color: "text-[#6B635C]", bg: "bg-[#E6E2DC]", border: "border-[#D1CBC3]" },
  ];

  const PAGE_TITLE: Record<Tab, string> = {
    dashboard: "Дашборд",
    bookings: "Заявки клиентов",
    services: "Каталог услуг",
    promo: "Управление акциями",
    reviews: "Видео отзывы",
  };
  const PAGE_SUB: Record<Tab, string> = {
    dashboard: "Сводка показателей",
    bookings: "Управление заявками",
    services: "Редактирование услуг",
    promo: "Промо-события на сайте",
    reviews: "Видеоотзывы на странице «О нас»",
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: SIDEBAR_BG }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-white font-black text-lg uppercase tracking-widest block">Нива Сервис</span>
        <p className="text-[#8C8378] text-xs mt-1">Панель управления</p>
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
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all relative"
              style={{
                background: isActive ? SIDEBAR_ACTIVE : "transparent",
                color: isActive ? "white" : "#8C8378",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#D5CFCA"; }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8C8378"; } }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: isActive ? "rgba(255,255,255,0.25)" : SIDEBAR_ACTIVE, color: "white" }}>
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
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#8C8378] hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          На сайт
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#8C8378] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Выйти из системы
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#F0EDE8" }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed top-0 left-0 h-full z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar (drawer) ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[260px] h-full z-50 shadow-2xl">
            <SidebarContent />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b-2 border-[#D1CBC3] px-5 h-[60px] flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 rounded-xl hover:bg-[#E6E2DC] text-[#6B635C] transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="text-base font-bold text-[#1C1F23] leading-tight">
              {PAGE_TITLE[tab]}
            </div>
            <p className="text-xs text-[#9C9488] leading-none mt-0.5">
              {PAGE_SUB[tab]}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 text-sm text-[#6B635C] hover:text-red-600 transition px-4 py-2 rounded-xl hover:bg-red-50 font-semibold border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-8">

          {/* Stats — always visible */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`bg-white rounded-2xl border-2 ${s.border} p-5 shadow-sm flex items-start gap-3`}>
                  <div className={`${s.bg} ${s.color} p-3 rounded-xl shrink-0 border ${s.border}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9C9488] mb-0.5 font-medium">{s.label}</p>
                    <p className="text-2xl font-black text-[#1C1F23]" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard tab */}
          {tab === "dashboard" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border-2 border-[#D1CBC3] shadow-sm p-6">
                <div className="font-bold text-[#1C1F23] mb-5 text-base">Последние заявки</div>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(b => {
                    const st = STATUS_LABEL[b.status] ?? STATUS_LABEL["NEW"];
                    return (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-[#E6E2DC] last:border-0">
                        <div>
                          <div className="font-bold text-[#1C1F23] text-base">{b.name}</div>
                          <div className="text-[#9C9488] text-sm mt-0.5">{new Date(b.createdAt).toLocaleDateString("ru-RU")}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {b.services.includes("callback") ? (
                            <span className="text-sm font-bold text-[#C8553D]">📞 Ждёт звонка</span>
                          ) : (
                            <span className="text-lg font-black text-[#1C1F23]" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{b.totalPrice.toLocaleString("ru-RU")} ₽</span>
                          )}
                          <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && <p className="text-[#9C9488] text-center py-6 text-base">Заявок пока нет</p>}
                </div>
                {bookings.length > 5 && (
                  <button onClick={() => setTab("bookings")} className="mt-5 text-base text-[#C8553D] font-bold hover:underline">
                    Показать все заявки →
                  </button>
                )}
              </div>

              <div className="bg-white rounded-2xl border-2 border-[#D1CBC3] shadow-sm p-8 flex flex-col items-center justify-center gap-5 text-center">
                <Users className="w-16 h-16 text-[#D1CBC3]" />
                <div>
                  <p className="font-bold text-[#1C1F23] text-lg">Добро пожаловать!</p>
                  <p className="text-[#6B635C] text-base mt-2 leading-relaxed">
                    Используйте меню слева для управления заявками, услугами и акциями.
                  </p>
                </div>
                <div className="flex gap-3 mt-2 flex-wrap justify-center">
                  <button onClick={() => setTab("bookings")} className="px-6 py-3 bg-[#C8553D] text-white rounded-xl text-base font-bold hover:bg-[#A8442F] transition">Заявки</button>
                  <button onClick={() => setTab("services")} className="px-6 py-3 bg-[#E6E2DC] text-[#1C1F23] rounded-xl text-base font-bold hover:bg-[#D1CBC3] transition">Услуги</button>
                  <button onClick={() => setTab("promo")} className="px-6 py-3 bg-[#FAE8E4] text-[#C8553D] border border-[#C8553D]/30 rounded-xl text-base font-bold hover:bg-[#F5D5CE] transition">Акции</button>
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
                <div className="font-bold text-[#1C1F23] text-base">Видео отзывы</div>
                <p className="text-[#6B635C] text-sm mt-1">Управление видеоотзывами на странице «О нас»</p>
              </div>
              <VideoReviewsManager />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
