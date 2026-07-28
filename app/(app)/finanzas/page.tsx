import Link from "next/link";
import { Plus, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getInvoices, getFinanceSummary } from "@/lib/finance-queries";
import { markOverdueAction } from "./actions";
import { InvoiceStatusFilter } from "@/components/finanzas/invoice-status-filter";
import { InvoiceRow } from "@/components/finanzas/invoice-row";

import { isStripeConfigured } from "@/lib/stripe";
import { Pagination } from "@/components/shared/pagination";
import { InvoiceCard } from "@/components/finanzas/invoice-card";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function FinanzasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  await markOverdueAction();

  const [{ invoices, total, totalPages }, summary] = await Promise.all([
    getInvoices(params.status, page),
    getFinanceSummary(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--foreground)]">
            Finanzas
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Matrículas, pagos y facturas.
          </p>
        </div>
        <Link
          href="/finanzas/nueva"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          <Plus size={16} />
          Nueva factura
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">Pendiente</p>
            <Wallet size={15} className="text-[var(--accent)]" />
          </div>
          <p className="mt-2 font-display text-2xl text-[var(--foreground)]">
            {formatCurrency(summary.totalPending)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">Cobrado</p>
            <CheckCircle2 size={15} className="text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-2xl text-[var(--foreground)]">
            {formatCurrency(summary.totalPaid)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">Vencido</p>
            <AlertTriangle size={15} className="text-red-500" />
          </div>
          <p className="mt-2 font-display text-2xl text-[var(--foreground)]">
            {formatCurrency(summary.totalOverdue)}
          </p>
        </div>
      </div>

      <InvoiceStatusFilter />

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No hay facturas con este filtro.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
          {/* Desktop: tabla */}
          <table className="hidden w-full text-sm lg:table">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <th className="px-5 py-3 font-medium">Estudiante</th>
                <th className="px-5 py-3 font-medium">Concepto</th>
                <th className="px-5 py-3 font-medium">Monto</th>
                <th className="px-5 py-3 font-medium">Vencimiento</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  stripeEnabled={isStripeConfigured}
                  invoice={{
                    id: inv.id,
                    studentName: inv.student.user.name,
                    concept: inv.concept,
                    amount: inv.amount,
                    dueDate: inv.dueDate.toLocaleDateString("es-ES"),
                    status: inv.status,
                    paidAmount: inv.payments.reduce(
                      (acc, p) => acc + p.amount,
                      0,
                    ),
                  }}
                />
              ))}
            </tbody>
          </table>

          {/* Mobile: cards apiladas */}
          <div className="divide-y divide-[var(--border-subtle)] lg:hidden">
            {invoices.map((inv) => (
              <InvoiceCard
                key={inv.id}
                stripeEnabled={isStripeConfigured}
                invoice={{
                  id: inv.id,
                  studentName: inv.student.user.name,
                  concept: inv.concept,
                  amount: inv.amount,
                  dueDate: inv.dueDate.toLocaleDateString("es-ES"),
                  status: inv.status,
                  paidAmount: inv.payments.reduce(
                    (acc, p) => acc + p.amount,
                    0,
                  ),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
