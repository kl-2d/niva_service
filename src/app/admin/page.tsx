import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminPage() {
  const [bookings, servicesCount] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.service.count(),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newToday = bookings.filter(b => new Date(b.createdAt) >= today).length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <AdminShell
      bookings={bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() }))}
      totalRevenue={totalRevenue}
      newToday={newToday}
      servicesCount={servicesCount}
    />
  );
}
