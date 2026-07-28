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

export function InvoiceRow({
  invoice,
  stripeEnabled,
}: {
  invoice: InvoiceData;
  stripeEnabled: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--background)]">
        <td className="px-5 py-3.5 font-medium text-[var(--foreground)]">
          {invoice.studentName}
        </td>
        <td className="px-5 py-3.5 text-[var(--text-muted)]">
          {invoice.concept}
        </td>
        <td className="px-5 py-3.5 text-[var(--foreground)]">
          ${invoice.amount.toFixed(2)}
          {invoice.paidAmount > 0 && invoice.status !== "PAID" && (
            <span className="ml-1 text-xs text-[var(--text-muted)]">
              (${invoice.paidAmount.toFixed(2)} abonado)
            </span>
          )}
        </td>
        <td className="px-5 py-3.5 text-[var(--text-muted)]">
          {invoice.dueDate}
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}
          >
            {statusLabels[invoice.status]}
          </span>
        </td>
        <td className="px-5 py-3.5 text-right">
          {invoice.status !== "PAID" && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Registrar pago
            </button>
          )}
        </td>
      </tr>

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
