import { prisma } from "@/lib/prisma";
import { InvoiceStatus, AttendanceStatus } from "@prisma/client";

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLast30 = new Date(now);
  startOfLast30.setDate(now.getDate() - 30);

  const [activeStudents, monthlyRevenue, attendanceRecords, avgScore] =
    await Promise.all([
      prisma.student.count({
        where: { user: { active: true } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: startOfMonth } },
      }),
      prisma.attendance.findMany({
        where: { date: { gte: startOfLast30 } },
        select: { status: true },
      }),
      prisma.evaluationEntry.aggregate({
        _avg: { score: true },
      }),
    ]);

  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(
    (a) => a.status === AttendanceStatus.PRESENT,
  ).length;
  const attendanceRate =
    totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

  return {
    activeStudents,
    monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
    attendanceRate: Math.round(attendanceRate * 10) / 10,
    avgPerformance: Math.round((avgScore._avg.score ?? 0) * 10) / 10,
  };
}

export async function getAttendanceTrend() {
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const results = await Promise.all(
    last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const records = await prisma.attendance.findMany({
        where: { date: { gte: date, lt: nextDay } },
        select: { status: true },
      });

      const present = records.filter(
        (r) => r.status === AttendanceStatus.PRESENT,
      ).length;
      const rate = records.length > 0 ? (present / records.length) * 100 : 0;

      return {
        day: date.toLocaleDateString("es-ES", { weekday: "short" }),
        asistencia: Math.round(rate),
      };
    }),
  );

  return results;
}

export async function getRecentInvoices() {
  return prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { student: { include: { user: true } } },
  });
}
