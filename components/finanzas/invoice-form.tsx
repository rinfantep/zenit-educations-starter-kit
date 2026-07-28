"use client";

import { useActionState } from "react";
import { createInvoiceAction } from "@/app/(app)/finanzas/actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function InvoiceForm({
  students,
}: {
  students: { id: string; display: string }[];
}) {
  const [error, formAction, pending] = useActionState(
    createInvoiceAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6"
    >
      <div>
        <label className={labelClass}>Estudiante</label>
        <select name="studentId" required className={inputClass}>
          <option value="">Seleccioná un estudiante</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.display}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Concepto</label>
        <input
          name="concept"
          required
          placeholder="Matrícula 2026"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Monto</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            placeholder="150.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Vencimiento</label>
          <input name="dueDate" type="date" required className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-5">
        <a
          href="/finanzas"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
        >
          {pending ? "Creando..." : "Crear factura"}
        </button>
      </div>
    </form>
  );
}
