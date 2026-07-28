"use client";

import { useActionState, useEffect, useState } from "react";
import { registerPaymentAction } from "@/app/(app)/finanzas/actions";
import { X, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function RegisterPaymentModal({
  invoiceId,
  remainingAmount,
  stripeEnabled,
  onClose,
}: {
  invoiceId: string;
  remainingAmount: number;
  stripeEnabled: boolean;
  onClose: () => void;
}) {
  const [error, formAction, pending] = useActionState(
    registerPaymentAction,
    undefined,
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleStripeCheckout() {
    setCheckoutLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setCheckoutLoading(false);
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-[var(--foreground)]">
            Registrar pago
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--foreground)]"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Saldo pendiente: ${remainingAmount.toFixed(2)}
        </p>

        {stripeEnabled && (
          <button
            onClick={handleStripeCheckout}
            disabled={checkoutLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/10 disabled:opacity-60"
          >
            <CreditCard size={15} />
            {checkoutLoading ? "Redirigiendo..." : "Pagar online con tarjeta"}
          </button>
        )}

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          <span className="text-xs text-[var(--text-muted)]">
            o registrar manualmente
          </span>
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="invoiceId" value={invoiceId} />

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              Monto
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              max={remainingAmount}
              defaultValue={remainingAmount}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              Método
            </label>
            <select name="method" required className={inputClass}>
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta (en oficina)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              Referencia (opcional)
            </label>
            <input
              name="reference"
              placeholder="N° de comprobante"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            onClick={() => setTimeout(onClose, 100)}
            className="w-full rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {pending ? "Guardando..." : "Confirmar pago"}
          </button>
        </form>
      </div>
    </div>
  );
}
