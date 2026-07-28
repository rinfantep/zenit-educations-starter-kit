"use client";

import { useState } from "react";
import { InvoiceStatus } from "@prisma/client";
import { RegisterPaymentModal } from "./register-payment-modal";

type InvoiceData = {
  id: string;
  studentName: string;
  concept: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAmount: number;
};

const statusStyles: Record<InvoiceStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  PAID: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  OVERDUE: "bg-red-500/10 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-500/10 text-slate-500",
};

const statusLabels: Record<InvoiceStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  CANCELLED: "Cancelada",
};

export function InvoiceCard({
  invoice,
  stripeEnabled,
}: {
  invoice: InvoiceData;
  stripeEnabled: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {invoice.studentName}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {invoice.concept}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}
          >
            {statusLabels[invoice.status]}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-display text-lg text-[var(--foreground)]">
              ${invoice.amount.toFixed(2)}
            </p>
            {invoice.paidAmount > 0 && invoice.status !== "PAID" && (
              <p className="text-xs text-[var(--text-muted)]">
                ${invoice.paidAmount.toFixed(2)} abonado
              </p>
            )}
            <p className="text-xs text-[var(--text-muted)]">
              Vence {invoice.dueDate}
            </p>
          </div>
          {invoice.status !== "PAID" && (
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition hover:border-[var(--accent)]"
            >
              Registrar pago
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <RegisterPaymentModal
          invoiceId={invoice.id}
          remainingAmount={invoice.amount - invoice.paidAmount}
          stripeEnabled={stripeEnabled}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
