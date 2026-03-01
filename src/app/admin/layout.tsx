import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления | Нива Сервис",
  robots: { index: false, follow: false },
};

/**
 * Admin-specific layout — excludes the main site Navbar, Footer, and Cart.
 * This completely overrides the root layout for all /admin/* routes.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      {children}
    </div>
  );
}
