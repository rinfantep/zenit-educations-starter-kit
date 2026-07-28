import { Users, Wallet, ClipboardCheck, TrendingUp } from "lucide-react";
import {
  getDashboardMetrics,
  getAttendanceTrend,
  getRecentInvoices,
} from "@/lib/dashboard-queries";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function DashboardPage() {
  const [metrics, trend, invoices] = await Promise.all([
    getDashboardMetrics(),
    getAttendanceTrend(),
    getRecentInvoices(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Panel general
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Resumen institucional en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Alumnos activos"
          value={metrics.activeStudents.toString()}
          icon={Users}
        />
        <MetricCard
          label="Ingresos del mes"
          value={formatCurrency(metrics.monthlyRevenue)}
          icon={Wallet}
        />
        <MetricCard
          label="Asistencia (30d)"
          value={`${metrics.attendanceRate}%`}
          icon={ClipboardCheck}
        />
        <MetricCard
          label="Rendimiento promedio"
          value={`${metrics.avgPerformance}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:col-span-2">
          <h2 className="font-display text-lg text-[var(--foreground)]">
            Tendencia de asistencia
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Últimos 7 días</p>
          <div className="mt-4">
            <AttendanceChart data={trend} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
          <h2 className="font-display text-lg text-[var(--foreground)]">
            Facturas recientes
          </h2>
          <div className="mt-4 space-y-3">
            {invoices.length === 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                Todavía no hay facturas registradas.
              </p>
            )}
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {inv.student.user.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {inv.concept}
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {formatCurrency(inv.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
